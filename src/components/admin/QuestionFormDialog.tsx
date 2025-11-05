import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { adminService } from '@/lib/services/adminService';
import { Question, Choice } from '@/lib/models/question';
import { DifficultySelect } from '@/components/admin/DifficultySelect';
import { 
  QuestionType, 
  QUESTION_TYPE_CONFIGS, 
  DB_TO_DIALOG_TYPE, 
  DIALOG_TO_DB_TYPE 
} from '@/lib/constants/questionTypes';
import { toast } from 'sonner';
import { validators, validateFormData } from '@/lib/utils/formValidation';

interface QuestionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question?: Question | null;
}

export function QuestionFormDialog({ open, onClose, onSuccess, question }: QuestionFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>('TC-1');
  const [formData, setFormData] = useState({
    question_text: '',
    difficulty_level: 'medium' as 'easy' | 'medium' | 'hard',
    topic: '',
    passage_id: '',
  });
  const [choices, setChoices] = useState<Choice[]>([]);

  useEffect(() => {
    if (question) {
      // Edit mode - populate from existing question
      const qType = DB_TO_DIALOG_TYPE[question.question_type] || question.question_type as QuestionType;
      
      // Validate question type
      if (!QUESTION_TYPE_CONFIGS[qType]) {
        console.error('Invalid question type from database:', question.question_type, 'Mapped to:', qType);
        toast.error(`Invalid question type: ${question.question_type}`);
        onClose();
        return;
      }

      setQuestionType(qType);
      setFormData({
        question_text: question.question_text || '',
        difficulty_level: question.difficulty_level as 'easy' | 'medium' | 'hard',
        topic: question.topic || '',
        passage_id: question.passage_id || '',
      });
      setChoices(question.choices || []);
    } else {
      // Create mode - initialize with empty choices based on question type
      setFormData({
        question_text: '',
        difficulty_level: 'medium',
        topic: '',
        passage_id: '',
      });
      setQuestionType('TC-1');
      initializeChoices('TC-1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, open]);

  useEffect(() => {
    // When question type changes in create mode, reset choices
    if (!question) {
      initializeChoices(questionType);
    }
  }, [questionType, question]);

  const initializeChoices = (type: QuestionType) => {
    const config = QUESTION_TYPE_CONFIGS[type];
    
    if (!config) {
      console.error('Invalid question type for initialization:', type);
      return;
    }

    const newChoices: Choice[] = [];

    if (config.blanks > 0) {
      // TC questions with blanks
      const optionsPerBlank = config.totalOptions / config.blanks;
      for (let blank = 1; blank <= config.blanks; blank++) {
        for (let i = 0; i < optionsPerBlank; i++) {
          newChoices.push({
            option: '',
            blank: blank,
            is_correct: false,
            reasoning: '',
          });
        }
      }
    } else {
      // SE, RC questions without blanks
      for (let i = 0; i < config.totalOptions; i++) {
        newChoices.push({
          option: '',
          blank: 0,
          is_correct: false,
          reasoning: '',
        });
      }
    }

    setChoices(newChoices);
  };

  const handleChoiceChange = (index: number, field: keyof Choice, value: string | boolean) => {
    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setChoices(newChoices);
  };

  const validateChoices = (): boolean => {
    const config = QUESTION_TYPE_CONFIGS[questionType];
    const correctChoices = choices.filter(c => c.is_correct);

    if (config.blanks > 0) {
      // For TC questions, each blank should have exactly 1 correct answer
      for (let blank = 1; blank <= config.blanks; blank++) {
        const blankCorrect = choices.filter(c => c.blank === blank && c.is_correct).length;
        if (blankCorrect !== 1) {
          toast.error(`Blank ${blank} must have exactly 1 correct answer`);
          return false;
        }
      }
    } else if (questionType === 'SE') {
      if (correctChoices.length !== 2) {
        toast.error('Sentence Equivalence must have exactly 2 correct answers');
        return false;
      }
    } else if (questionType === 'RC-multi') {
      if (correctChoices.length < 1 || correctChoices.length > 3) {
        toast.error('Reading Comp (Multiple) must have 1-3 correct answers');
        return false;
      }
    } else {
      if (correctChoices.length !== 1) {
        toast.error('This question type must have exactly 1 correct answer');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateFormData([
      () => validators.required(formData.question_text, 'question text'),
      () => validators.required(formData.topic, 'a topic'),
      () => validators.allArrayItemsNotEmpty(choices),
      validateChoices,
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      const questionData = {
        question_type: DIALOG_TO_DB_TYPE[questionType],
        question_text: formData.question_text,
        difficulty_level: formData.difficulty_level,
        topic: formData.topic,
        passage_id: formData.passage_id || undefined,
        choices: choices,
      };

      if (question) {
        await adminService.updateQuestion(question.id, questionData);
        toast.success('Question updated successfully');
      } else {
        await adminService.createQuestion(questionData);
        toast.success('Question created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save question:', error);
      toast.error('Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const renderChoicesForType = () => {
    const config = QUESTION_TYPE_CONFIGS[questionType];

    if (!config) {
      console.error('Invalid question type:', questionType);
      return <div className="text-red-500">Invalid question type: {questionType}</div>;
    }

    if (config.blanks > 0) {
      // TC questions - group by blank
      return (
        <div className="space-y-6">
          {[...Array(config.blanks)].map((_, blankIndex) => {
            const blankNumber = blankIndex + 1;
            const blankChoices = choices.filter(c => c.blank === blankNumber);
            
            return (
              <div key={blankNumber} className="space-y-3">
                <Label className="text-base font-semibold">
                  Blank {blankNumber} Options ({blankChoices.length} options, select 1 correct)
                </Label>
                {blankChoices.map((choice, idx) => {
                  const globalIndex = choices.findIndex(
                    c => c.blank === blankNumber && c.option === choice.option && c === choice
                  );
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                      <div className="col-span-1 flex items-center justify-center pt-2">
                        <Checkbox
                          checked={choice.is_correct}
                          onCheckedChange={(checked) =>
                            handleChoiceChange(globalIndex, 'is_correct', checked as boolean)
                          }
                        />
                      </div>
                      <div className="col-span-11 space-y-2">
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          value={choice.option}
                          onChange={(e) => handleChoiceChange(globalIndex, 'option', e.target.value)}
                        />
                        <Textarea
                          placeholder="Reasoning (optional)"
                          value={choice.reasoning}
                          onChange={(e) => handleChoiceChange(globalIndex, 'reasoning', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    } else {
      // SE, RC questions - single list
      const correctCountText = typeof config.correctCount === 'number' 
        ? `select ${config.correctCount} correct`
        : `select ${config.correctCount} correct`;

      return (
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Options ({choices.length} options, {correctCountText})
          </Label>
          {choices.map((choice, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
              <div className="col-span-1 flex items-center justify-center pt-2">
                <Checkbox
                  checked={choice.is_correct}
                  onCheckedChange={(checked) =>
                    handleChoiceChange(idx, 'is_correct', checked as boolean)
                  }
                />
              </div>
              <div className="col-span-11 space-y-2">
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={choice.option}
                  onChange={(e) => handleChoiceChange(idx, 'option', e.target.value)}
                />
                <Textarea
                  placeholder="Reasoning (optional)"
                  value={choice.reasoning}
                  onChange={(e) => handleChoiceChange(idx, 'reasoning', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit Question' : 'Create New Question'}</DialogTitle>
          <DialogDescription>
            {question ? 'Update the question details below' : 'Fill in the details for the new question'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type Selection - Only in create mode */}
          {!question && (
            <div className="space-y-2">
              <Label htmlFor="question_type">Question Type *</Label>
              <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                <SelectTrigger id="question_type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QUESTION_TYPE_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* If editing, show question type as read-only */}
          {question && (
            <div className="space-y-2">
              <Label>Question Type</Label>
              <div className="p-2 bg-muted rounded-md text-sm">
                {QUESTION_TYPE_CONFIGS[questionType]?.label || questionType}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <DifficultySelect
              value={formData.difficulty_level}
              onChange={(value) => setFormData((prev) => ({ ...prev, difficulty_level: value }))}
            />

            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Science, History, Literature"
                className="mt-2"
              />
            </div>
          </div>

          {/* Passage ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="passage_id">Passage ID (Optional - for RC questions)</Label>
            <Input
              id="passage_id"
              value={formData.passage_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, passage_id: e.target.value }))}
              placeholder="Enter passage ID if this is a reading comprehension question"
              className="mt-2"
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData((prev) => ({ ...prev, question_text: e.target.value }))}
              placeholder="Enter the question text. Use {{blank}} for text completion questions."
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Choices */}
          {renderChoicesForType()}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : question ? 'Update Question' : 'Create Question'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
