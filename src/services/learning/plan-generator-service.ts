
// Virtual plan generator service - uses virtual plans instead of database tables
export { 
  generateVirtualLearningPlan as generatePersonalizedLearningPlan,
  checkUserHasProgress as checkUserHasLearningPlans,
  ensureUserHasVirtualPlan as ensureUserHasLearningPlan,
  getCurrentVirtualPlan
} from './virtual-plan-service';
