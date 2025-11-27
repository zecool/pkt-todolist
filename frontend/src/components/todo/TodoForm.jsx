import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { format } from 'date-fns';

const TodoForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = "저장"
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    startDate: initialData?.startDate || format(new Date(), 'yyyy-MM-dd'),
    dueDate: initialData?.dueDate || '',
  });

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        startDate: initialData.startDate || format(new Date(), 'yyyy-MM-dd'),
        dueDate: initialData.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        dueDate: '',
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목은 필수 입력 항목입니다';
    }

    if (formData.dueDate && formData.startDate && formData.dueDate < formData.startDate) {
      newErrors.dueDate = '만료일은 시작일과 같거나 이후여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="제목 *"
          id="title"
          type="text"
          placeholder="할일 제목을 입력하세요"
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
        />
      </div>

      <div>
        <Input
          label="내용"
          id="content"
          as="textarea"
          placeholder="할일 내용을 입력하세요"
          rows="4"
          value={formData.content}
          onChange={handleInputChange}
          error={errors.content}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="시작일"
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            error={errors.startDate}
          />
        </div>

        <div>
          <Input
            label="만료일"
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            error={errors.dueDate}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;