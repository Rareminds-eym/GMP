-- Create winners_list_l1 table for Level 2 access control
CREATE TABLE IF NOT EXISTS winners_list_l1 (
    idx SERIAL PRIMARY KEY,
    id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(100),
    team_name VARCHAR(100),
    college_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    is_team_leader BOOLEAN,
    session_id UUID,
    join_code VARCHAR(20),
    team_size INTEGER
);

-- Insert sample record (user_id excluded)
INSERT INTO winners_list_l1 (
    id, email, phone, full_name, team_name, college_code, created_at, is_team_leader, session_id, join_code, team_size
) VALUES (
    '662ac6e4-4aa5-403c-a961-83fc6a4e1587',
    'sinjinee@rareminds.in',
    '9017877654',
    'Sinjinee',
    'kihuh',
    'per169',
    '2025-08-05 04:52:45.116609+00',
    TRUE,
    '68501cfa-c837-4b82-b64f-b7ba7df5ce4e',
    'WPRQXB',
    2
);
