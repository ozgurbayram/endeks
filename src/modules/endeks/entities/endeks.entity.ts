import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import AbstractEntity from "../../../core/entities/abstract.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
@Unique(["issued_at", "user"])
class Endeks extends AbstractEntity {
  @Column({ type: "date", nullable: false })
  issued_at: string;

  @Column({ type: "numeric", nullable: false })
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}

export default Endeks;
