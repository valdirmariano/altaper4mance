-- Create table for running sessions
CREATE TABLE public.running_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    distance_km NUMERIC(5,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    pace NUMERIC(4,2),
    terrain VARCHAR(50) DEFAULT 'asfalto',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for workout sessions
CREATE TABLE public.workout_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    name VARCHAR(255) NOT NULL,
    muscle_group VARCHAR(100),
    duration_minutes INTEGER,
    exercises JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for body measurements
CREATE TABLE public.body_measurements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,2),
    waist_cm NUMERIC(5,2),
    chest_cm NUMERIC(5,2),
    arm_cm NUMERIC(5,2),
    leg_cm NUMERIC(5,2),
    body_fat_percent NUMERIC(4,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.running_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Create policies for running_sessions
CREATE POLICY "Users can view their own running sessions" 
ON public.running_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own running sessions" 
ON public.running_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own running sessions" 
ON public.running_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own running sessions" 
ON public.running_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions" 
ON public.workout_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout sessions" 
ON public.workout_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" 
ON public.workout_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" 
ON public.workout_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for body_measurements
CREATE POLICY "Users can view their own body measurements" 
ON public.body_measurements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own body measurements" 
ON public.body_measurements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body measurements" 
ON public.body_measurements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body measurements" 
ON public.body_measurements 
FOR DELETE 
USING (auth.uid() = user_id);