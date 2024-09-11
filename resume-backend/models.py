
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
    def __init__(self, id, filename, role, job_level, top_skills):
        self.id = id
        self.filename = filename
        self.top_skills = top_skills
        self.role = role
        self.job_level = job_level

    def to_dict(self):
        resume_dict = {}

        resume_dict['id'] = self.id
        resume_dict['filename'] = self.filename
        resume_dict['top_skills'] = self.top_skills
        resume_dict['role'] = self.role
        resume_dict['job_level'] = self.job_level

        return resume_dict