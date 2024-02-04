import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import AbstractEntity from "../../../core/entities/abstract.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
class Endeks extends AbstractEntity {
  @Column({ type: "date" })
  issued_at: string;

  @Column({ type: "numeric" })
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}

export default Endeks;
