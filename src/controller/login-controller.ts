import { Request, Response } from "express";
import { LoginService } from "../service/login-service";

export class LoginController {
    private service: LoginService;

    constructor(service: LoginService){
        this.service = service;
    }

    realizaLogin = async (req: Request, res: Response): Promise<void> => {
        const {email, senha} = req.body;
        try {
            let token = await this.service.verificarLogin(email, senha);
            res.status(201).json({token: token});
        }   
        catch(err: any) {
            const status = err && err.id ? err.id : 500;
            const message = err && err.msg ? err.msg : (err && err.message ? err.message : "Internal server error");
            res.status(status).json({ error: message });
        }
    }
}