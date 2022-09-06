import {JobPosition} from './JobPosition';
import {AcademicLevel} from './AcademicLevel';
import {Rank} from './Rank';
import {User} from './User';
import {StatusJob} from './StatusJob';
import {WorkingForm} from './WorkingForm';

export interface Job{
  id: number;
  name: string;
  jobPosition: JobPosition;
  numberExperience: number;
  addressWork: string;
  academicLevel: AcademicLevel;
  rank: Rank;
  qtyPerson: number;
  createDate?: Date;
  dueDate: Date;
  updateDate: Date;
  updateUser: User;
  skills: string;
  startRecruitmentDate?: Date;
  workingForm: WorkingForm;
  jobRequirement: string;
  description: string;
  benefits: string;
  salaryMax: number;
  salaryMin: number;
  contact: User;
  statusJob: StatusJob;
  views: number;
  creator: User;
  reason: string;
  delete?: boolean;
}
