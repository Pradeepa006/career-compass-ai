import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });
        Cookies.set("access_token", data.access_token, { expires: 1 });
        Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth endpoints
export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.put("/users/profile", data),
  getStats: () => api.get("/users/stats"),
};

// Resume endpoints
export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
  list: () => api.get("/resume/list"),
  get: (id: string) => api.get(`/resume/${id}`),
  roast: (id: string) => api.post(`/resume/${id}/roast`),
  atsCheck: (id: string, jobDescription: string) =>
    api.post(`/resume/${id}/ats-check?job_description=${encodeURIComponent(jobDescription)}`),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

// Career endpoints
export const careerApi = {
  predict: (data: any) => api.post("/career/predict", data),
  history: () => api.get("/career/history"),
  getRoadmap: (career: string) => api.get(`/career/roadmap/${encodeURIComponent(career)}`),
  getTrending: () => api.get("/career/industries/trending"),
  getInterviewQuestions: (career: string, level?: string) =>
    api.get(`/career/interview-questions/${encodeURIComponent(career)}?level=${level || "intermediate"}`),
};

// Skills endpoints
export const skillsApi = {
  gapAnalysis: (data: any) => api.post("/skills/gap-analysis", data),
  trending: (limit?: number, category?: string) =>
    api.get(`/skills/trending${limit ? `?limit=${limit}` : ""}${category ? `&category=${category}` : ""}`),
  categories: () => api.get("/skills/categories"),
};

// Jobs endpoints
export const jobsApi = {
  recommendations: (limit?: number) => api.get(`/jobs/recommendations${limit ? `?limit=${limit}` : ""}`),
  search: (params: any) => api.get("/jobs/search", { params }),
  matchScore: (jobId: string) => api.get(`/jobs/match-score/${jobId}`),
};

// Chatbot endpoints
export const chatbotApi = {
  sendMessage: (data: any) => api.post("/chatbot/message", data),
  getSessions: () => api.get("/chatbot/sessions"),
  getSession: (id: string) => api.get(`/chatbot/sessions/${id}`),
};

// GitHub endpoints
export const githubApi = {
  analyze: (username: string) => api.get(`/github/analyze/${username}`),
  myAnalysis: () => api.get("/github/my-analysis"),
  trending: (language?: string) => api.get(`/github/trending-repos${language ? `?language=${language}` : ""}`),
};

// Salary endpoints
export const salaryApi = {
  predict: (data: any) => api.post("/salary/predict", data),
  benchmarks: (role: string) => api.get(`/salary/benchmarks/${encodeURIComponent(role)}`),
  topPayingSkills: () => api.get("/salary/top-paying-skills"),
};

// Admin endpoints
export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (page?: number) => api.get(`/admin/users${page ? `?page=${page}` : ""}`),
  getTrendingCareers: () => api.get("/admin/trending-careers"),
};
