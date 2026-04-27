import os

backend_dir = "../IUniverse-BackEnd"

# 1. Update SubmissionRepository
repo_path = os.path.join(backend_dir, "src/main/java/com/iuniverse/repository/SubmissionRepository.java")
with open(repo_path, "r") as f:
    content = f.read()
if "findProblemSetIdsByStudentUserId" not in content:
    content = content.replace("}", "    @org.springframework.data.jpa.repository.Query(\"SELECT s.problemSet.id FROM Submission s WHERE s.student.user.id = :studentId\")\n    List<Long> findProblemSetIdsByStudentUserId(@org.springframework.data.repository.query.Param(\"studentId\") Long studentId);\n}")
    with open(repo_path, "w") as f:
        f.write(content)

# 2. Update SubmissionService
service_path = os.path.join(backend_dir, "src/main/java/com/iuniverse/service/SubmissionService.java")
with open(service_path, "r") as f:
    content = f.read()
if "getCompletedProblemSets" not in content:
    content = content.replace("}", "\n    public List<Long> getCompletedProblemSets(Long studentId) {\n        return submissionRepository.findProblemSetIdsByStudentUserId(studentId);\n    }\n}")
    with open(service_path, "w") as f:
        f.write(content)

# 3. Update StudentController
controller_path = os.path.join(backend_dir, "src/main/java/com/iuniverse/controller/StudentController.java")
with open(controller_path, "r") as f:
    content = f.read()
if "my-submissions" not in content:
    new_endpoint = """
    @Operation(summary = "Get my submissions", description = "Get list of problem set IDs that the student has completed")
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/my-submissions")
    public ResponseEntity<Object> getMySubmissions(Authentication authentication) {
        Long studentId = userService.findByUsername(authentication.getName()).getId();
        List<Long> completedIds = submissionService.getCompletedProblemSets(studentId);
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "Get completed problem sets successfully!");
        result.put("data", completedIds);
        
        return ResponseEntity.ok(result);
    }
"""
    content = content.replace("}", new_endpoint + "\n}")
    with open(controller_path, "w") as f:
        f.write(content)

print("Backend patched successfully")
