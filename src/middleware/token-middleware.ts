import { NextFunction, Request, Response } from "express";
import { LoginService } from "../service/login-service";

export class TokenMiddleware {
    private service: LoginService;

    constructor (service: LoginService) {
        this.service = service;
    }

    verificarAcesso = async (req: Request, res: Response, next: NextFunction) => {
        let token = req.get("Authorization");
        if(token) {
            try{
                await this.service.validarToken(token);
                next();
            }
            catch(err: any){
                res.status(err.id).json({erro: err.msg});
            }
        } 
        else {
            res.status(401).json({error: "Nenhum Token informado!"});    
        }       
    }
}