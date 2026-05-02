import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "./pet";
import { Veterinario } from "./veterinario";

@Entity()
export class Consulta {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column({ type: 'date' })
    data?: Date;
    @Column({ type: 'time' })
    hora?: string;
    @Column({
        type: 'enum',
        enum: ['AGENDADA', 'CONCLUIDA', 'CANCELADA'],
        default: 'AGENDADA'
    })
    status?: string;
    @ManyToOne(() => Pet, pet => pet.consultas)
    pet?: Pet;
    @ManyToOne(() => Veterinario, vet => vet.consultas)
    veterinario?: Veterinario;
}