import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import BlogUser from "./user";

@Entity()
class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ nullable: true })
  photo: String;

  @Column({ nullable: true })
  title: String;

  @Column({ nullable: true })
  intro: String;

  @Column({ type: "text", array: true, nullable: true })
  outlines: string[];

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => BlogUser, (user) => user.blogs)
  user: BlogUser;

  formattedCreatedDate: String;
  static username: any;
  @CreateDateColumn({ default: new Date() })
  cratedDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;

  @AfterLoad()
  setFormattedDate() {
    this.formattedCreatedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Baghdad",
    }).format(this.cratedDate);
  }
}

export default Blog;
