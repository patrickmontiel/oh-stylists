export const WORKOUT_DAYS = {
  1: {
    label: 'D1', name: 'Push · Hombro', subtitle: 'Hombro-Prioridad + Pecho',
    exercises: [
      { id: 'd1_lateral_raise',        name: 'Lateral Raise',            sets: 4, repsMin: 12, repsMax: 15, defaultWeight: 10,   group: 'Hombro' },
      { id: 'd1_shoulder_press',        name: 'Shoulder Press Machine',   sets: 3, repsMin: 8,  repsMax: 8,  defaultWeight: 40,   group: 'Hombro' },
      { id: 'd1_incline_chest',         name: 'Incline Chest Press',      sets: 3, repsMin: 10, repsMax: 10, defaultWeight: 50,   group: 'Pecho' },
      { id: 'd1_low_cable_flyes',       name: 'Low Cable Flyes',          sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 15,   group: 'Pecho' },
      { id: 'd1_lateral_raise_remate',  name: 'Lateral Raise (Remate)',   sets: 2, repsMin: 0,  repsMax: 0,  defaultWeight: 8,    group: 'Hombro', toFailure: true },
      { id: 'd1_triceps_cuerda',        name: 'Tríceps Cuerda',           sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 18,   group: 'Tríceps' },
    ]
  },
  2: {
    label: 'D2', name: 'Pull · Anchura', subtitle: 'Anchura de Espalda',
    exercises: [
      { id: 'd2_pulldown',              name: 'Pull-down Amplio',         sets: 4, repsMin: 8,  repsMax: 10, defaultWeight: 40,   group: 'Espalda' },
      { id: 'd2_seated_row',            name: 'Seated Row',               sets: 4, repsMin: 10, repsMax: 10, defaultWeight: 30,   group: 'Espalda' },
      { id: 'd2_reverse_pec_deck',      name: 'Reverse Pec Deck',         sets: 4, repsMin: 15, repsMax: 15, defaultWeight: 35,   group: 'Hombro Post.' },
      { id: 'd2_reverse_grip_row',      name: 'Reverse Grip Row',         sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 20,   group: 'Espalda' },
      { id: 'd2_cable_biceps',          name: 'Cable Bíceps Curl',        sets: 3, repsMin: 10, repsMax: 10, defaultWeight: 25,   group: 'Bíceps' },
    ]
  },
  3: {
    label: 'D3', name: 'Pierna A', subtitle: 'Cuádriceps · Femoral',
    exercises: [
      { id: 'd3_leg_press',             name: 'Leg Press',                sets: 4, repsMin: 10, repsMax: 10, defaultWeight: 58,   group: 'Cuádriceps' },
      { id: 'd3_leg_extension',         name: 'Leg Extension',            sets: 4, repsMin: 12, repsMax: 12, defaultWeight: 60,   group: 'Cuádriceps' },
      { id: 'd3_lying_leg_curl',        name: 'Lying Leg Curl',           sets: 4, repsMin: 12, repsMax: 12, defaultWeight: 25,   group: 'Femoral' },
      { id: 'd3_inner_outer',           name: 'Inner & Outer Thigh',      sets: 3, repsMin: 15, repsMax: 15, defaultWeight: 40,   group: 'Aductor' },
      { id: 'd3_pantorrilla',           name: 'Pantorrilla',              sets: 4, repsMin: 15, repsMax: 15, defaultWeight: 0,    group: 'Pantorrilla', optional: true },
    ]
  },
  4: {
    label: 'D4', name: 'Push · Pecho', subtitle: 'Pecho-Prioridad + Hombro',
    exercises: [
      { id: 'd4_pec_deck',              name: 'Pec Deck',                 sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 30,   group: 'Pecho' },
      { id: 'd4_incline_chest',         name: 'Incline Chest Press',      sets: 3, repsMin: 8,  repsMax: 8,  defaultWeight: 50,   group: 'Pecho' },
      { id: 'd4_high_cable_flyes',      name: 'High Cable Flyes',         sets: 3, repsMin: 15, repsMax: 15, defaultWeight: 20,   group: 'Pecho' },
      { id: 'd4_lateral_raise',         name: 'Lateral Raise',            sets: 4, repsMin: 15, repsMax: 15, defaultWeight: 10,   group: 'Hombro' },
      { id: 'd4_face_pull',             name: 'Face Pull',                sets: 3, repsMin: 15, repsMax: 15, defaultWeight: 15,   group: 'Hombro Post.' },
      { id: 'd4_skull_crusher',         name: 'Skull Crusher',            sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 25,   group: 'Tríceps' },
    ]
  },
  5: {
    label: 'D5', name: 'Pull · Grosor', subtitle: 'Grosor + Brazos',
    exercises: [
      { id: 'd5_chinups',               name: 'Chin-ups Asistidas',       sets: 4, repsMin: 10, repsMax: 10, defaultWeight: 100,  group: 'Espalda', unit: 'lb asist.' },
      { id: 'd5_seated_row_neutro',     name: 'Seated Row Neutro',        sets: 4, repsMin: 8,  repsMax: 8,  defaultWeight: 45,   group: 'Espalda' },
      { id: 'd5_back_extension',        name: 'Back Extension',           sets: 3, repsMin: 15, repsMax: 20, defaultWeight: 0,    group: 'Lumbar', bodyweight: true },
      { id: 'd5_hammer_curl',           name: 'Hammer Curl',              sets: 3, repsMin: 10, repsMax: 10, defaultWeight: 12.5, group: 'Bíceps' },
      { id: 'd5_triceps_dip',           name: 'Tríceps Dip Asistido',     sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 0,    group: 'Tríceps' },
      { id: 'd5_antebrazo',             name: 'Antebrazo Barra',          sets: 3, repsMin: 15, repsMax: 15, defaultWeight: 0,    group: 'Antebrazo' },
    ]
  },
  6: {
    label: 'D6', name: 'Hombro + Core', subtitle: 'Deltoide · Core',
    exercises: [
      { id: 'd6_superset_lateral',      name: 'Lateral Raise',            sets: 4, repsMin: 12, repsMax: 12, defaultWeight: 10,   group: 'Hombro', superset: 'A' },
      { id: 'd6_superset_rpd',          name: 'Reverse Pec Deck',         sets: 4, repsMin: 12, repsMax: 12, defaultWeight: 35,   group: 'Hombro Post.', superset: 'A' },
      { id: 'd6_cable_front',           name: 'Cable Front Raise',        sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 15,   group: 'Hombro' },
      { id: 'd6_shoulder_press',        name: 'Shoulder Press',           sets: 3, repsMin: 8,  repsMax: 8,  defaultWeight: 40,   group: 'Hombro' },
      { id: 'd6_hanging_leg',           name: 'Hanging Leg Raise',        sets: 3, repsMin: 12, repsMax: 12, defaultWeight: 0,    group: 'Core', bodyweight: true },
      { id: 'd6_cable_crunch',          name: 'Cable Crunch',             sets: 3, repsMin: 15, repsMax: 15, defaultWeight: 20,   group: 'Core' },
      { id: 'd6_plank',                 name: 'Plank',                    sets: 3, repsMin: 45, repsMax: 45, defaultWeight: 0,    group: 'Core', bodyweight: true, seconds: true },
    ]
  },
  7: {
    label: 'D7', name: 'Descanso', subtitle: 'Recuperación Total', rest: true, exercises: []
  }
}

export const USER_PROFILE = {
  height: 174,
  startWeight: 81,
  startBodyFat: 21,
  targetBodyFat: 13,
  proteinGoal: 145,
  calorieGoal: 2100,
}
