import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  PlayCircle,
  CheckCircle2,
  Download,
  Settings,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");

  const course = {
    code: "CS101",
    title: "Introduction to Computer Science",
    instructor: "Dr. Smith",
    duration: "12 Weeks",
    credits: 3,
    status: "Active",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Course Header */}
      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="bg-white/50 border-primary/20 text-primary font-bold tracking-wider"
              >
                {course.code}
              </Badge>
              <Badge className="gradient-primary text-primary-foreground">
                {course.status}
              </Badge>
            </div>
            <div>
              <h2 className="font-display text-4 sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {course.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-foreground/70 font-medium">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-5 w-5" />
                  <span>{course.instructor}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30"></div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.credits} Credits</span>
                </div>
              </div>
            </div>
          </div>
          {user?.role === "Lecturer" && (
            <Button
              variant="outline"
              className="rounded-xl bg-white/50 hover:bg-white shadow-sm border-border/60 shrink-0"
            >
              <Settings className="mr-2 h-4 w-4" />
              Course Settings
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-8">
          <TabsList className="w-full max-w-2xl glass p-1.5 rounded-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <Card className="glass border-none shadow-xl">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Course Overview
              </CardTitle>
              <CardDescription className="text-base">
                Learn the basics of computer science
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                This course provides an introduction to computer science and
                programming. Topics include problem-solving, algorithm design,
                data structures, and software engineering principles.
              </p>
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <h4 className="font-display font-semibold text-lg text-foreground mb-4">
                  Learning Objectives:
                </h4>
                <ul className="space-y-3">
                  {[
                    "Understand fundamental programming concepts.",
                    "Design and implement basic algorithms.",
                    "Analyze the efficiency of algorithms.",
                    "Write clean, maintainable code.",
                  ].map((objective, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-0">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl font-semibold">
                Course Modules
              </h3>
              {user?.role === "Lecturer" && (
                <Button size="sm" className="rounded-xl">
                  Add Module
                </Button>
              )}
            </div>

            <Accordion type="multiple">
              {[1, 2, 3, 4].map((module) => (
                <AccordionItem
                  key={module}
                  value={`module-${module}`}
                  className="glass border-none shadow-md"
                >
                  <AccordionTrigger>
                    <div className="flex items-center gap-6 text-left w-full pr-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-display text-xl font-bold border border-primary/10">
                        {module}
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-xl font-semibold text-foreground">
                          {module === 1
                            ? "Introduction to Python"
                            : module === 2
                              ? "Control Flow"
                              : module === 3
                                ? "Data Structures"
                                : "Functions & Modules"}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium mt-1.5">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" /> 3 Lessons
                          </span>
                          <div className="w-1 h-1 rounded-full bg-border"></div>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" /> 1 Assignment
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-[5.5rem]">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="group flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-border hover:shadow-sm cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              {i === 1 ? (
                                <PlayCircle className="h-5 w-5" />
                              ) : (
                                <FileText className="h-5 w-5" />
                              )}
                            </div>
                            <span className="text-base font-medium text-foreground">
                              {i === 1
                                ? `Video Lecture ${module}.${i}`
                                : `Reading Material ${module}.${i}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                              {i === 1 ? "15:00" : "10 min read"}
                            </span>
                            {user?.role === "Student" && (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-4 border border-accent/20 bg-accent/5 rounded-xl mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="text-base font-semibold text-accent">
                            Assignment {module}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-white border-accent/20 text-accent"
                        >
                          Due in 3 days
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="mt-0">
          <Card className="glass border-none shadow-xl">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Enrolled Students
              </CardTitle>
              <CardDescription className="text-base">
                120 students currently enrolled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">
                        Student ID
                      </TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-medium text-xs">
                              S{i}
                            </div>
                            Student Name {i}
                          </div>
                        </TableCell>
                        <TableCell>IU{2023000 + i}</TableCell>
                        <TableCell>student{i}@iu.edu</TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-none">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="mt-0">
          {user?.role === "Student" ? (
            <Card className="glass border-none shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-2xl">
                      My Grades
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Your performance in this course
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground">
                      Overall Grade
                    </div>
                    <div className="font-display text-3xl font-bold text-primary">
                      85%{" "}
                      <span className="text-lg text-muted-foreground font-medium">
                        (A-)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="font-semibold">Item</TableHead>
                        <TableHead className="font-semibold">Weight</TableHead>
                        <TableHead className="font-semibold">Score</TableHead>
                        <TableHead className="font-semibold">
                          Feedback
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium py-4">
                          Assignment 1
                        </TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell className="font-semibold">90/100</TableCell>
                        <TableCell className="text-muted-foreground italic">
                          "Good work on algorithms."
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium py-4">
                          Midterm Exam
                        </TableCell>
                        <TableCell>30%</TableCell>
                        <TableCell className="font-semibold">82/100</TableCell>
                        <TableCell className="text-muted-foreground italic">
                          "Review data structures."
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass border-none shadow-xl">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  Gradebook
                </CardTitle>
                <CardDescription className="text-base">
                  Manage grades for all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="font-semibold">Student</TableHead>
                        <TableHead className="font-semibold">
                          A1 (10%)
                        </TableHead>
                        <TableHead className="font-semibold">
                          A2 (10%)
                        </TableHead>
                        <TableHead className="font-semibold">
                          Midterm (30%)
                        </TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-medium text-xs">
                                S{i}
                              </div>
                              Student {i}
                            </div>
                          </TableCell>
                          <TableCell>90</TableCell>
                          <TableCell>85</TableCell>
                          <TableCell>88</TableCell>
                          <TableCell className="font-bold text-primary">
                            87.5%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
