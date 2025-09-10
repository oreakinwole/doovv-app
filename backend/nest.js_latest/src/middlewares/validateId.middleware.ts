import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InvestArticle } from 'src/schemas/learn.invest.schema';
import { InvestGlossary } from 'src/schemas/learn.invest.schema';
import { InvestVideo } from 'src/schemas/learn.invest.schema';
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


// @Injectable()
// export class ValidateIdMiddleware implements NestMiddleware {
//     constructor(@InjectModel(InvestArticle.name) private investArticleModel: Model<InvestArticle>) {}

//     async use(req: Request, res: Response, next: NextFunction) {
//         const { id } = req.params

//         if (!Types.ObjectId.isValid(id)) {
//             throw new HttpException('Invalid ID format', 400)
//         }

//         next()
//     }
// }


@Injectable()
export class ValidateArticleIdMiddleware implements NestMiddleware {
    constructor(@InjectModel(InvestArticle.name) private investArticleModel: Model<InvestArticle>) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', 400)
        }

        const articleId = await this.investArticleModel.findById(id).exec()

        if (!articleId) {
            throw new HttpException('Article does not exist', 404)
        }
        next()
    }
}


@Injectable()
export class ValidateGlossaryIdMiddleware implements NestMiddleware {
    constructor(@InjectModel(InvestGlossary.name) private investGlossaryModel: Model<InvestGlossary>) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', 400)
        }

        const glossaryId = await this.investGlossaryModel.findById(id).exec()

        if (!glossaryId) {
            throw new HttpException('Glossary does not exist', 404)
        }

        next()
    }
}


@Injectable()
export class ValidateVideoIdMiddleware implements NestMiddleware {
    constructor(@InjectModel(InvestVideo.name) private investVideoModel: Model<InvestVideo>) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', 400)
        }
    
        const videoId = await this.investVideoModel.findById(id).exec()

        if (!videoId) {
            throw new HttpException('Video does not exist', 404)
        }

        next()
    }
}