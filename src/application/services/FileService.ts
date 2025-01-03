import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import {Context} from "../../utilities/Context";
import {ProcessingError} from "../../utilities/Error";

export class FileService {
    private UPLOADS_DIR = path.join(process.env.STATIC_FILES_PATH!, 'uploads', 'avatars');
    
    async uploadAvatar(ctx: Context, file: any) {
        let filename = `${Date.now()}-${file.originalname}`;
        let filePath = path.join(this.UPLOADS_DIR, filename);

        try {
            await fs.mkdir(this.UPLOADS_DIR, {recursive: true});

            const processedBuffer = await sharp(file.buffer)
                .resize(512, 512)
                .jpeg({ quality: 80 })
                .toBuffer();

            await fs.writeFile(filePath, processedBuffer);
            return filename;
        } catch (error: any) {
            ctx.addError(new ProcessingError(error.message, "file"));
        }
    }
}