import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Veterinario } from "./veterinario";

@Entity()
export class Especialidade {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @ManyToMany(() => Veterinario, vet => vet.especialidades)
    veterinarios?: Veterinario[];
}