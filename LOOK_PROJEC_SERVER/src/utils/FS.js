import chalk from "chalk"
import fs from "fs"
import { join } from "path"


export default {
    readFile: (file_path) => {
        const DB_PATH = join(process.cwd(), 'src', 'db', file_path) 
        return  fs.promises.readFile(DB_PATH, 'utf-8')
    },
    async writeFile(file_path, data) {
        const DB_PATH = join(process.cwd(), 'src', 'db', file_path) 
        
        await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 4))
        return true
    }
    
}