/**
 * ============================================================================
 * STUDENT APPLICATION FORM COMPONENT
 * ============================================================================
 * Multi-step form for student application submission with document upload
 */

'use client';

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { applicationService } from '@/services/application.service';
import { Application, SocioeconomicLevel } from '@/types';
import LoadingSpinner from '@/components/common/Loading';
import Card from '@/components/common/Card';

// Form validation schema
const applicationFormSchema = z.object({
  program_id: z.string().min(1, 'Please select a program'),
  academic_score: z
    .number()
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must not exceed 100'),
  personal_statement: z.string().min(100, 'Personal statement must be at least 100 characters'),
  motivation_statement: z.string().min(100, 'Motivation statement must be at least 100 characters'),
  socioeconomic_level: z.enum(['low', 'medium', 'high'] as const),
  household_monthly_income: z.number().min(0, 'Income must be a positive number'),
  dependents_count: z.number().int().min(0, 'Cannot have negative dependents'),
  disability_status: z.boolean().default(false),
  previous_institution: z.string().optional(),
  previous_gpa: z.number().min(0).max(4.0).optional(),
});

type ApplicationFormData = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  programs: Array<{ id: string; name: string; description: string }>;
  onSuccess?: (application: Application) => void;
  onError?: (error: string) => void;
}

const CHANCEN_GREEN = '#22C55E';
const ACCENT_COLORS = {
  blue: '#3B82F6',
  orange: '#F97316',
  gray: '#6B7280',
};

export default function StudentApplicationForm({
  programs,
  onSuccess,
  onError,
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ name: string; file: File }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      socioeconomic_level: 'medium',
      dependents_count: 0,
      disability_status: false,
    },
  });

  const submitMutation = useMutation(
    (data: ApplicationFormData) =>
      applicationService.submitApplication({
        ...data,
        documents: uploadedDocuments,
      }),
    {
      onSuccess: (data) => {
        reset();
        setCurrentStep(1);
        setUploadedDocuments([]);
        onSuccess?.(data);
      },
      onError: (error: any) => {
        onError?.(error.message || 'Failed to submit application');
      },
    }
  );

  const programId = watch('program_id');
  const totalSteps = 4;

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        onError?.('File size must be less than 10MB');
        return;
      }
      setUploadedDocuments(prev => [...prev, { name: file.name, file }]);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (fileName: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.name !== fileName));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitMutation.mutateAsync(data);
    }
  };

  if (submitMutation.isLoading) {
    return <LoadingSpinner />;
  }

  if (submitMutation.isSuccess) {
    return (
      <Card className="bg-white shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl text-green-500 mb-4">✓</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been received. You will receive an email confirmation shortly.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-blue-900 mb-2">Next Steps:</p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>1. Wait for initial screening (3-5 business days)</li>
              <li>2. AI-powered candidate ranking will be applied</li>
              <li>3. Admissions team will review your profile</li>
              <li>4. You will receive a decision notification</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Application Form</h1>
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Program Selection & Academic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Program & Academic Background</h2>

              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Program <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="program_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                        errors.program_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Choose a program...</option>
                      {programs.map(prog => (
                        <option key={prog.id} value={prog.id}>
                          {prog.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.program_id && <p className="text-red-500 text-sm mt-1">{errors.program_id.message}</p>}
              </div>

              {/* Academic Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Score (0-100) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="academic_score"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="Enter your current academic score"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                        errors.academic_score ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.academic_score && <p className="text-red-500 text-sm mt-1">{errors.academic_score.message}</p>}
              </div>

              {/* Previous Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Institution
                </label>
                <Controller
                  name="previous_institution"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Name of your previous school/institution"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  )}
                />
              </div>

              {/* Previous GPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous GPA (0-4.0)
                </label>
                <Controller
                  name="previous_gpa"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      placeholder="Your GPA from previous institution"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Personal & Financial Information */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Financial & Household Information</h2>

              {/* Socioeconomic Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Socioeconomic Level <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="socioeconomic_level"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {(['low', 'medium', 'high'] as const).map(level => (
                        <label key={level} className="flex items-center cursor-pointer">
                          <input
                            {...field}
                            type="radio"
                            value={level}
                            checked={field.value === level}
                            className="w-4 h-4 text-green-500"
                          />
                          <span className="ml-2 text-gray-700 capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Household Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Household Monthly Income (RWF) <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="household_monthly_income"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="Enter monthly household income"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                        errors.household_monthly_income ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.household_monthly_income && (
                  <p className="text-red-500 text-sm mt-1">{errors.household_monthly_income.message}</p>
                )}
              </div>

              {/* Dependents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Dependents <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="dependents_count"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="Number of people dependent on household income"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${
                        errors.dependents_count ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
              </div>

              {/* Disability */}
              <div className="flex items-center">
                <Controller
                  name="disability_status"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={field.value}
                      className="w-4 h-4 text-green-500 rounded"
                    />
                  )}
                />
                <label className="ml-2 text-gray-700">I have a disability status</label>
              </div>
            </div>
          )}

          {/* Step 3: Personal Statement */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Personal Statement</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about yourself <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="personal_statement"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={6}
                      placeholder="Share your background, challenges, and aspirations. Minimum 100 characters."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none ${
                        errors.personal_statement ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.personal_statement && (
                  <p className="text-red-500 text-sm mt-1">{errors.personal_statement.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why this program? <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="motivation_statement"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={6}
                      placeholder="Explain your motivation for choosing this program and how it aligns with your career goals."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none ${
                        errors.motivation_statement ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.motivation_statement && (
                  <p className="text-red-500 text-sm mt-1">{errors.motivation_statement.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Supporting Documents</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  📄 Upload documents such as transcripts, ID, proof of income, and any other supporting materials.
                  Maximum 10MB per file.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <div className="text-4xl mb-2">📁</div>
                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Uploaded Documents:</h3>
                  {uploadedDocuments.map(doc => (
                    <div key={doc.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.name)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {submitMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{submitMutation.error instanceof Error ? submitMutation.error.message : 'An error occurred'}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              ← Previous
            </button>

            <button
              type="submit"
              disabled={submitMutation.isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
            >
              {currentStep === totalSteps ? '✓ Submit Application' : 'Next →'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
