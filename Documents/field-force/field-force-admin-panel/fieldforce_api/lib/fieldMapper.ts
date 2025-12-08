import { query } from './db';

/**
 * Helper functions to map HRMS text fields to FieldForce UUID fields
 */

/**
 * Map department name (TEXT) to department_id (UUID)
 */
export async function mapDepartmentToId(departmentName: string | undefined): Promise<string | null> {
  if (!departmentName) return null;

  try {
    const result = await query(
      'SELECT id FROM departments WHERE LOWER(name) = LOWER($1) AND is_active = true LIMIT 1',
      [departmentName.trim()]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    // If department doesn't exist, you might want to create it or return null
    // For now, returning null - the user can select manually
    console.warn(`Department "${departmentName}" not found in fieldforce database`);
    return null;
  } catch (error) {
    console.error('Error mapping department:', error);
    return null;
  }
}

/**
 * Map manager name (TEXT) to manager_id (UUID) by finding employee with matching name
 */
export async function mapManagerToId(managerName: string | undefined): Promise<string | null> {
  if (!managerName) return null;

  try {
    // Try to find manager by name (assuming format: "First Last" or "Last, First")
    const nameParts = managerName.trim().split(/[\s,]+/);
    
    if (nameParts.length >= 2) {
      const result = await query(
        `SELECT id FROM employees 
         WHERE (LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2))
            OR (LOWER(first_name) = LOWER($2) AND LOWER(last_name) = LOWER($1))
         AND is_active = true 
         LIMIT 1`,
        [nameParts[0], nameParts[1]]
      );

      if (result.rows.length > 0) {
        return result.rows[0].id;
      }
    }

    // Try exact match on full name
    const fullNameResult = await query(
      `SELECT id FROM employees 
       WHERE CONCAT(LOWER(first_name), ' ', LOWER(last_name)) = LOWER($1)
       AND is_active = true 
       LIMIT 1`,
      [managerName.trim()]
    );

    if (fullNameResult.rows.length > 0) {
      return fullNameResult.rows[0].id;
    }

    console.warn(`Manager "${managerName}" not found in fieldforce database`);
    return null;
  } catch (error) {
    console.error('Error mapping manager:', error);
    return null;
  }
}

/**
 * Map jobtitle (TEXT) to jobtitle_id (UUID) from lookup table
 */
export async function mapJobTitleToId(jobTitle: string | undefined): Promise<string | null> {
  if (!jobTitle) return null;

  try {
    const result = await query(
      `SELECT id FROM lookup 
       WHERE LOWER(name) = LOWER($1) AND key = 'jobtitle' AND is_active = true 
       LIMIT 1`,
      [jobTitle.trim()]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    // If jobtitle doesn't exist, you might want to create it or return null
    console.warn(`Job title "${jobTitle}" not found in lookup table`);
    return null;
  } catch (error) {
    console.error('Error mapping job title:', error);
    return null;
  }
}

/**
 * Map branch name (TEXT) to branch_id (UUID)
 */
export async function mapBranchToId(branchName: string | undefined): Promise<string | null> {
  if (!branchName) return null;

  try {
    // Try to match by unit_code first, then by name
    const result = await query(
      `SELECT id FROM branches 
       WHERE (LOWER(unit_code) = LOWER($1) OR LOWER(name) LIKE LOWER($2)) 
       AND is_active = true 
       LIMIT 1`,
      [branchName.trim(), `%${branchName.trim()}%`]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    console.warn(`Branch "${branchName}" not found in fieldforce database`);
    return null;
  } catch (error) {
    console.error('Error mapping branch:', error);
    return null;
  }
}

/**
 * Map role name (TEXT) to role_id (UUID)
 */
export async function mapRoleToId(roleName: string | undefined): Promise<string | null> {
  if (!roleName) return null;

  try {
    const result = await query(
      `SELECT id FROM roles 
       WHERE LOWER(name) = LOWER($1) AND is_active = true 
       LIMIT 1`,
      [roleName.trim()]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    console.warn(`Role "${roleName}" not found in fieldforce database`);
    return null;
  } catch (error) {
    console.error('Error mapping role:', error);
    return null;
  }
}

