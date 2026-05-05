import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Consulta } from "./consulta";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    nome?: string;
    @Column()
    especie?: string;
    @Column({ type: 'date' })
    dataNascimento?: Date;
    @Column()
    raca?: string;
    @ManyToOne(() => Cliente, cliente => cliente.pets)
    cliente?: Cliente;
    @OneToMany(() => Consulta, consulta => consulta.pet)
    consultas?: Consulta[];
}

