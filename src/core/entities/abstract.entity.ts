import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class AbstractEntity {
	@PrimaryGeneratedColumn({})
	id: number;
}

export default AbstractEntity;
