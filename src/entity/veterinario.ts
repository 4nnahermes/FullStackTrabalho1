import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Especialidade } from "./especialidade";
import { Consulta } from "./consulta";

@Entity()
export class Veterinario {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @ManyToMany(() => Especialidade, esp => esp.veterinarios)
    @JoinTable()
    especialidades?: Especialidade[];
    @OneToMany(() => Consulta, consulta => consulta.veterinario)
    consultas?: Consulta[];
}