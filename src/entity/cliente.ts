import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pet } from "./pet";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @Column({ unique: true })
    cpf?: string;
    @Column({ unique: true })
    email?: string;
    @Column()
    telefone?: string;
    @OneToMany(() => Pet, pet => pet.cliente)
    pets?: Pet[];
}