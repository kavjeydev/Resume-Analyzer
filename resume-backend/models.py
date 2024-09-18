
class Resume:
    def __init__(self, id, uid, filename, thumbnail, top_skills, role, job_level):
        self.id = id
        self.uid = uid
        self.filename = filename
        self.thumbnail = thumbnail
        self.top_skills = top_skills
        self.role = role
        self.job_level = job_level



    def to_dict(self):
        resume_dict = {}

        resume_dict['id'] = self.id
        resume_dict['uid'] = self.uid
        resume_dict['filename'] = self.filename
        resume_dict['thumbnail'] = self.thumbnail
        resume_dict['top_skills'] = self.top_skills
        resume_dict['role'] = self.role
        resume_dict['job_level'] = self.job_level

        return resume_dict

class ResumeInfo:
    def __init__(self, uid, filename, role, job_level, top_skills, listing_min_salary, listing_max_salary, company_role_min_salary,
                 company_role_max_salary,company_name, market_min_salary, market_max_salary,
                 ten_year_progression, ss_to_add, ts_to_add, company_culture):

        self.uid = uid
        self.filename = filename # resume name
        self.top_skills = top_skills

        self.role = role
        self.job_level = job_level
        self.company_name = company_name

        self.listing_min_salary = listing_min_salary
        self.listing_max_salary = listing_max_salary
        self.company_role_min_salary = company_role_min_salary

        self.company_role_max_salary = company_role_max_salary
        self.market_min_salary = market_min_salary
        self.market_max_salary = market_max_salary

        self.ten_year_progression = ten_year_progression
        self.ss_to_add = ss_to_add
        self.ts_to_add = ts_to_add

        self.company_culture = company_culture

    def to_dict(self):
        resume_dict = {}


        resume_dict['uid'] = self.uid
        resume_dict['filename'] = self.filename
        resume_dict['top_skills'] = self.top_skills

        resume_dict['role'] = self.role
        resume_dict['job_level'] = self.job_level
        resume_dict['company_name'] = self.company_name

        resume_dict['listing_min_salary'] = self.listing_min_salary
        resume_dict['listing_max_salary'] = self.listing_max_salary
        resume_dict['company_role_min_salary'] = self.company_role_min_salary

        resume_dict['company_role_max_salary'] = self.company_role_max_salary
        resume_dict['market_min_salary'] = self.market_min_salary
        resume_dict['market_max_salary'] = self.market_max_salary

        resume_dict['ten_year_progression'] = self.ten_year_progression
        resume_dict['ss_to_add'] = self.ss_to_add
        resume_dict['ts_to_add'] = self.ts_to_add

        resume_dict['company_culture'] = self.company_culture


        return resume_dict