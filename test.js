import { cleanText } from "./utils/cleanText";
import fs from 'node:fs/promises';


async function readJSON(){
    try {
        const data = await fs.readFile("./drawing_json_converted/entityMtextText.json" , "utf-8");
        const jsonData = JSON.parse(data);
        
        let result = jsonData.map(item => {
                return { [item] : cleanText(item)}
            
        });
        await fs.writeFile("compare.json" , JSON.stringify(result , null , 2))

    } catch (error) {
        console.log(error);
        
    }
}

readJSON()