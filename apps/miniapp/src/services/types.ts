export type ApiCode = number;

export interface ApiResponse<T> {
  code: ApiCode;
  message: string;
  data: T;
}

export interface InitUserRequest {
  anonymous_id?: string;
}

export interface InitUserResponse {
  token: string;
  anonymous_id: string;
}

export interface SessionStartRequest {
  anonymous_id: string;
}

export interface SessionStartResponse {
  session_id: string;
}

export interface ChatMessageRequest {
  session_id: string;
  message: string;
}

export interface ChatMessageResponse {
  reply: string;
}

export type ReportTaskState = 'pending' | 'running' | 'done' | 'failed';

export interface ReportTaskCreateRequest {
  session_id: string;
  profile: {
    skin_type: string;
    wash_time: string;
    makeup_habit: string;
    routine_steps: string[];
    allergy_input: string;
    allergy_preset: string[];
  };
}

export interface ReportTaskCreateResponse {
  task_id: string;
}

export interface ReportTaskStatusResponse {
  task_id: string;
  state: ReportTaskState;
  report_id?: string;
  error_message?: string;
}

export interface RoutineStep {
  title: string;
  desc: string;
  tip?: string;
}

export interface ReportFixedFields {
  skin_type: string;
  main_issues: string[];
  recommended_ingredients: string[];
  avoid_ingredients: string[];
  morning_routine: RoutineStep[];
  night_routine: RoutineStep[];
  product_tips: string[];
  confidence: number;
}

export interface ReportDetailResponse extends ReportFixedFields {
  report_id: string;
}

export interface BindUserRequest {
  anonymous_id: string;
  login_code: string;
}

export interface BindUserResponse {
  token: string;
  user_id: string;
}

export interface ShopCard {
  id: string;
  title: string;
  subtitle?: string;
  cover_url?: string;
  jump_url: string;
}
