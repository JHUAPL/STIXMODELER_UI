/**
 * Import configurations to set on page load.
 * 
 */

import config from '../../config/config.json';

export const CREATOR_ID = config.creator_id;

export async function importSchemas() {
    const schemas = [];
    for (const file of config.schemas) {
        try {
            const path = `${config.schema_dir}/${file}`;
            const schema = await import(path);
            schemas.push(schema);
        } catch {
            console.log(`Couldn't import schema ${file}`)
        }
    }
    return schemas;
}