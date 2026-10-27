export const parseExcelSheet = (rows) => {
  if (!rows.length) return [];

  // Filter out completely empty rows and metadata rows
  const validRows = rows.filter(row => {
    if (!row || row.length === 0) return false;
    
    // Check if this row contains metadata objects (like meta: { school_id: test })
    const hasMetadataObject = row.some(cell => {
      if (!cell || typeof cell !== 'object') return false;
      
      // Check for common metadata patterns
      return cell.meta || 
             cell.school_id || 
             cell.schoolId ||
             (cell.constructor === Object && Object.keys(cell).length === 1 && Object.keys(cell)[0].includes('_id'));
    });
    
    if (hasMetadataObject) return false;
    
    // Check if this row has some non-empty values
    const hasData = row.some(cell => 
      cell !== null && 
      cell !== undefined && 
      cell !== "" && 
      !(typeof cell === 'object' && Object.keys(cell).length === 0)
    );
    
    return hasData;
  });

  if (validRows.length < 2) return []; // Need at least group row and field row

  const [groupRow, fieldRow, ...dataRows] = validRows;
  const dataList = [];

  console.log(`🔍 Group Row:`, groupRow);
  console.log(`🔍 Field Row:`, fieldRow);
  console.log(`🔍 Data Rows Count:`, dataRows.length);

  for (const row of dataRows) {
    // Skip empty rows
    if (!row || row.every(cell => cell === null || cell === undefined || cell === "")) {
      continue;
    }

    console.log(`🔍 Processing data row:`, row);

    // Initialize record with proper structure
    let record = {
      meta: {},
      profile: {},
      guardian_details: {
        address: {}
      },
      education: {},
      documents: []
    };

    groupRow.forEach((group, index) => {
      const field = fieldRow[index];
      const value = row[index] || "";

      // Skip if no field name
      if (!field) return;

      // If no group specified, try to find the group from previous columns
      let actualGroup = group;
      if (!actualGroup) {
        // Look backwards to find the most recent group
        for (let i = index - 1; i >= 0; i--) {
          if (groupRow[i]) {
            actualGroup = groupRow[i];
            break;
          }
        }
      }

      // If still no group found, treat as non_object
      if (!actualGroup) {
        actualGroup = "non_object";
      }

      console.log(`🔍 Processing: group="${group}", actualGroup="${actualGroup}", field="${field}", value="${value}"`);

      // Handle nested group structures (like guardian_details.address, documents.proof)
      if (actualGroup.includes('.')) {
        const groupParts = actualGroup.split('.');
        let currentLevel = record;
        
        // Navigate/create nested structure
        for (let i = 0; i < groupParts.length; i++) {
          const part = groupParts[i];
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          if (i === groupParts.length - 1) {
            // Last level - add the field
            currentLevel[part][field] = value;
          } else {
            // Intermediate level - move deeper
            currentLevel = currentLevel[part];
          }
        }
      } else if (actualGroup === "non_object") {
        // Direct field (not part of any group)
        record[field] = value;
      } else {
        // Handle simple groups (meta, profile, guardian_details, education, etc.)
        if (!record[actualGroup]) record[actualGroup] = {};
        record[actualGroup][field] = value;
      }
    });

    console.log(`🔍 Record before cleanup:`, JSON.stringify(record, null, 2));

    // Clean up empty nested objects
    if (Object.keys(record.meta).length === 0) delete record.meta;
    if (Object.keys(record.profile).length === 0) delete record.profile;
    if (Object.keys(record.guardian_details).length === 0) delete record.guardian_details;
    if (Object.keys(record.education).length === 0) delete record.education;
    if (Array.isArray(record.documents) && record.documents.length === 0) delete record.documents;

    console.log(`🔍 Final record:`, JSON.stringify(record, null, 2));

    // Only add record if it has some meaningful data
    if (Object.keys(record).length > 0) {
      dataList.push(record);
    }
  }

  return dataList;
};
