
// Helper function to map skill codes to IDs
export const getSkillId = (skillCode: string): number | null => {
  switch (skillCode) {
    case 'TRACK_LOCATE': return 1;
    case 'INTERPRET_RELATE': return 2;
    case 'EVALUATE_REFLECT': return 3;
    default: return null;
  }
};

// Helper function to get initial skill levels
export const getInitialSkillLevels = (): Record<string, number> => ({
  'TRACK_LOCATE': 0,
  'INTERPRET_RELATE': 0,
  'EVALUATE_REFLECT': 0
});
