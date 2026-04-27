import os

backend_dir = "../IUniverse-BackEnd"

def patch_file(filepath, injection):
    with open(filepath, "r") as f:
        content = f.read()
    
    if injection in content:
        return
        
    # Find the last closing brace
    last_brace_idx = content.rfind("}")
    if last_brace_idx != -1:
        new_content = content[:last_brace_idx] + injection + "\n}\n"
        with open(filepath, "w") as f:
            f.write(new_content)

repo_injection = """
    @org.springframework.data.jpa.repository.Query("SELECT s.problemSet.id FROM Submission s WHERE s.student.user.id = :studentId")
    List<Long> findProblemSetIdsByStudentUserId(@org.springframework.data.repository.query.Param("studentId") Long studentId);
"""
patch_file(os.path.join(backend_dir, "src/main/java/com/iuniverse/repository/SubmissionRepository.java"), repo_injection)

service_injection = """
    public List<Long> getCompletedProblemSets(Long studentId) {
        return submissionRepository.findProblemSetIdsByStudentUserId(studentId);
    }
"""
patch_file(os.path.join(backend_dir, "src/main/java/com/iuniverse/service/SubmissionService.java"), service_injection)

controller_injection = """
    @io.swagger.v3.oas.annotations.Operation(summary = "Get my submissions", description = "Get list of problem set IDs that the student has completed")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('STUDENT')")
    @org.springframework.web.bind.annotation.GetMapping("/my-submissions")
    public org.springframework.http.ResponseEntity<Object> getMySubmissions(org.springframework.security.core.Authentication authentication) {
        Long studentId = userService.findByUsername(authentication.getName()).getId();
        List<Long> completedIds = submissionService.getCompletedProblemSets(studentId);
        
        java.util.Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("status", org.springframework.http.HttpStatus.OK.value());
        result.put("message", "Get completed problem sets successfully!");
        result.put("data", completedIds);
        
        return org.springframework.http.ResponseEntity.ok(result);
    }
"""
patch_file(os.path.join(backend_dir, "src/main/java/com/iuniverse/controller/StudentController.java"), controller_injection)

print("Patch applied properly")
