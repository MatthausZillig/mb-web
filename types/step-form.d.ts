export interface StepFormItemProps {
    id: string;
    fields: Array<{ name: string, label: string, type: string,required: boolean }>;
  }
  
  export interface StepFormProps {
    steps: StepFormItemProps[];
    defaultValues: Record<string, any>;
    onSubmit(values: Record<string, any>): void;
  }