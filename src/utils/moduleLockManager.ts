import type { Module } from '../types/module';

export interface LockCondition {
  type: 'user_email' | 'progress_based' | 'time_based' | 'custom';
  value: any;
  operator?: 'equals' | 'greater_than' | 'less_than' | 'contains';
}

export interface LockRule {
  id: string;
  moduleId: string;
  condition: LockCondition;
  unlockAction: 'unlock' | 'available' | 'completed';
  description?: string;
}

export class ModuleLockManager {
  private rules: LockRule[] = [];

  addRule(rule: LockRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  clearRules(): void {
    this.rules = [];
  }

  applyRules(modules: Module[], context: Record<string, any>): Module[] {
    return modules.map(module => {
      const applicableRules = this.rules.filter(rule => rule.moduleId === module.id);
      
      if (applicableRules.length === 0) {
        return module; // No rules for this module
      }

      // Check if any rule matches
      const matchedRule = applicableRules.find(rule => this.evaluateCondition(rule.condition, context));
      
      if (matchedRule) {
        return {
          ...module,
          status: matchedRule.unlockAction as any
        };
      }

      return module;
    });
  }

  private evaluateCondition(condition: LockCondition, context: Record<string, any>): boolean {
    const { type, value, operator = 'equals' } = condition;
    const contextValue = context[type];

    switch (operator) {
      case 'equals':
        return contextValue === value;
      case 'contains':
        return typeof contextValue === 'string' && contextValue.includes(value);
      case 'greater_than':
        return Number(contextValue) > Number(value);
      case 'less_than':
        return Number(contextValue) < Number(value);
      default:
        return false;
    }
  }

  getRules(): LockRule[] {
    return [...this.rules];
  }
}

// Global instance
export const moduleLockManager = new ModuleLockManager();

// Setup function with predefined rules
export function setupModuleLocking(): void {
  moduleLockManager.clearRules();
  
  // Rules for hackathon user - unlock module 1 and HL2
  moduleLockManager.addRule({
    id: 'hackathon_user_module_1',
    moduleId: '1',
    condition: {
      type: 'user_email',
      value: 'hackathon@example.com',
      operator: 'equals'
    },
    unlockAction: 'available',
    description: 'Unlock module 1 for hackathon user'
  });

  moduleLockManager.addRule({
    id: 'hackathon_user_module_hl2',
    moduleId: 'HL2',
    condition: {
      type: 'user_email',
      value: 'hackathon@example.com',
      operator: 'equals'
    },
    unlockAction: 'available',
    description: 'Unlock HL2 for hackathon user'
  });
  
  console.log('🔐 Module locking rules configured:', moduleLockManager.getRules().length, 'rules active');
}