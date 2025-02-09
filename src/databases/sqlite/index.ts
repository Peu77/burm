import processCondition from "./condition";
import executeDatabaseQuery from "./executor";

function initializeModel(queryObject, databaseObject) {

    let parameters = [ ];

    for (const key in databaseObject.parameters) {

        // console.log(databaseObject.parameter[key]);
        let current = databaseObject.parameters[key];

        let attribs = [
            (current.primary !== undefined && current.primary) ? "PRIMARY" : undefined,
            (current.key !== undefined && current.key) ? "KEY" : undefined
        ];

        parameters.push(`${key} ${current.type} ${attribs.join(' ')}`.trim());

    }

    return executeDatabaseQuery(`CREATE TABLE IF NOT EXISTS ${databaseObject.name} (${parameters.join(', ')});`);

}

function findOne(queryObject, databaseObject) {

    return executeDatabaseQuery(`SELECT * FROM ${databaseObject.name}${(queryObject.where !== undefined) ? ` WHERE ${processCondition(queryObject.where)}` : ""} LIMIT 1;`);

}

function findAll(queryObject, databaseObject) {

    return executeDatabaseQuery(`SELECT * FROM ${databaseObject.name}${(queryObject.where !== undefined) ? ` WHERE ${processCondition(queryObject.where)}` : ""};`);

}

function create(queryObject, databaseObject) {

    let params:Array<string> = [];
    let values:Array<string> = [];

    for (const key in queryObject) {
        
        params.push(key);
        values.push(`"${queryObject[key]}"`);

    }

    return executeDatabaseQuery(`INSERT INTO ${databaseObject.name}(${params.join(', ')}) VALUES (${values.join(', ')});`);

}

function remove(queryObject, databaseObject) {

    if (queryObject.where == undefined) return { };

    return executeDatabaseQuery(`DELETE FROM ${databaseObject.name} WHERE ${processCondition(queryObject.where)};`);

}

function clear(queryObject, databaseObject) {

    return executeDatabaseQuery(`DELETE FROM ${databaseObject.name};`);

}

function customQuery(customQueryText) {

    return executeDatabaseQuery(customQueryText);

}

export default {
    initializeModel,
    findOne,
    findAll,
    create,
    remove,
    clear,
    customQuery
};