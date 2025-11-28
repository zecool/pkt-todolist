import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon, Check, X } from 'lucide-react';
import useTodoStore from '../../stores/todoStore';
import useUiStore from '../../stores/uiStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateDateRange, validateTodoTitle, validateTodoContent } from '../../utils/validator';

const TodoForm = ({ todo = null }) => {
  const isEditing = !!todo;
  const { createTodo, updateTodo } = useTodoStore();
  const { closeModal } = useUiStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial values when editing
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        content: todo.content || '',
        startDate: todo.startDate || '',
        dueDate: todo.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        startDate: '',
        dueDate: '',
      });
    }
  }, [todo]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목은 필수 입력 항목입니다';
    } else if (!validateTodoTitle(formData.title)) {
      newErrors.title = '제목은 200자를 넘을 수 없습니다';
    }
    
    if (formData.content && !validateTodoContent(formData.content)) {
      newErrors.content = '내용은 1000자를 넘을 수 없습니다';
    }
    
    if (!validateDateRange(formData.startDate, formData.dueDate)) {
      newErrors.dueDate = '만료일은 시작일과 같거나 이후여야 합니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      // Prepare data with proper null handling
      const submitData = {
        title: formData.title.trim(),
        content: formData.content ? formData.content.trim() : '',
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined,
      };

      if (isEditing) {
        result = await updateTodo(todo.todoId, submitData);
      } else {
        result = await createTodo(submitData);
      }

      if (result.success) {
        closeModal();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <Input
            id="title"
            name="title"
            label="제목 *"
            type="text"
            placeholder="할일 제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
        </div>

        <div>
          <Input
            id="content"
            name="content"
            label="내용"
            type="textarea"
            placeholder="할일 내용을 입력하세요"
            rows={4}
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="startDate"
              name="startDate"
              label="시작일"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
          </div>

          <div>
            <Input
              id="dueDate"
              name="dueDate"
              label="만료일"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
          </div>
        </div>

        {errors.root && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errors.root}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => closeModal()}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-1" />
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          <Check className="h-4 w-4 mr-1" />
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;