import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  OneToMany,
} from "typeorm";
import Blog from "./blogs";

@Entity()
class BlogUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  fullName: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: true,
    default:
      "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
  })
  profileImg: string;

  @CreateDateColumn({ default: new Date() })
  cratedDate: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedDate: Date;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  formattedCreatedDate: String;
  static username: any;

  @AfterLoad()
  setFormattedDate() {
    this.formattedCreatedDate = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Baghdad",
    }).format(this.cratedDate);
  }
}

export default BlogUser;
