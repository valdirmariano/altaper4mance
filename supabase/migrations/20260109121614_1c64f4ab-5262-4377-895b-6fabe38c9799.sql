-- Create courses/studies table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    platform TEXT,
    skill TEXT,
    status TEXT NOT NULL DEFAULT 'backlog',
    progress NUMERIC DEFAULT 0,
    total_hours NUMERIC DEFAULT 0,
    completed_hours NUMERIC DEFAULT 0,
    url TEXT,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own courses" 
ON public.courses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses" 
ON public.courses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
ON public.courses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
ON public.courses FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create pomodoro_sessions table
CREATE TABLE public.pomodoro_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sessions_count INTEGER DEFAULT 0,
    focus_minutes INTEGER DEFAULT 0,
    daily_goal INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, session_date)
);

-- Enable RLS
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own pomodoro sessions" 
ON public.pomodoro_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pomodoro sessions" 
ON public.pomodoro_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pomodoro sessions" 
ON public.pomodoro_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_pomodoro_sessions_updated_at
BEFORE UPDATE ON public.pomodoro_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();