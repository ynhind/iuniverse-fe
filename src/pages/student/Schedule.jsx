import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import { studentApi } from '@/api/student.api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

const MOCK_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

export function StudentSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await studentApi.getMyCourses();
        const courses = res?.data || res || [];
        
        // Map enrolled courses to mock schedule events
        const mockEvents = courses.map((course, index) => {
          const day = DAYS[index % 5]; // Spread across Mon-Fri
          const startHour = 8 + (index * 2) % 8; // Spread across 8 AM to 4 PM
          return {
            id: course.id || index,
            title: course.title || course.courseName || `Course ${index + 1}`,
            type: 'lecture',
            day: day,
            start: startHour,
            duration: 2, // Default 2 hours
            location: `Room ${301 + index}`,
            color: MOCK_COLORS[index % MOCK_COLORS.length],
            colorLight: MOCK_COLORS[index % MOCK_COLORS.length].split(' ')[0], // bg-blue-100
            colorText: MOCK_COLORS[index % MOCK_COLORS.length].split(' ')[1]   // text-blue-700
          };
        });
        
        setEvents(mockEvents);
      } catch (error) {
        console.error("Failed to fetch courses for schedule", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getEventStyle = (event) => {
    const dayIndex = DAYS.indexOf(event.day);
    const startHour = event.start - 8;
    return {
      gridColumn: `${dayIndex + 2} / span 1`,
      gridRow: `${Math.floor(startHour * 2) + 2} / span ${Math.floor(event.duration * 2)}`,
    };
  };

  const formatHour = (h) => {
    return {
      display: h === 12 ? '12:00' : h > 12 ? `${h - 12}:00` : `${h}:00`,
      ampm: h >= 12 ? 'PM' : 'AM'
    };
  };

  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">Schedule</h2>
          <p className="text-lg text-slate-500 mt-1">Manage your classes, assignments, and meetings.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/50 rounded-2xl p-1 shadow-sm border border-slate-200/60">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white text-slate-500">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="px-4 font-medium text-slate-700">This Week</span>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white text-slate-500">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button className="rounded-2xl shadow-md shadow-primary/20">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="glass border-none shadow-xl shadow-slate-200/40 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-[80px_repeat(7,1fr)] grid-rows-[auto_repeat(26,minmax(30px,1fr))] min-w-[800px] overflow-x-auto bg-white/40">
                {/* Header Row */}
                <div className="col-start-1 row-start-1 border-b border-r border-slate-200/60 bg-slate-50/50 p-4"></div>
                {DAYS.map((day, i) => (
                  <div key={day} className="col-start-auto row-start-1 border-b border-r border-slate-200/60 bg-slate-50/50 p-4 text-center">
                    <div className="font-medium text-slate-500">{day}</div>
                    <div className="text-2xl font-display font-semibold text-slate-900 mt-1">{15 + i}</div>
                  </div>
                ))}

                {/* Time Grid */}
                {HOURS.map((hour, i) => (
                  <React.Fragment key={hour}>
                    <div 
                      className="col-start-1 border-r border-b border-slate-200/60 p-2 text-right text-xs font-medium text-slate-400 relative"
                      style={{ gridRow: `${i * 2 + 2} / span 2` }}
                    >
                      <span className="absolute top-[-8px] right-2 bg-white/80 px-1 rounded">
                        {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </span>
                    </div>
                    {DAYS.map((_, dayIndex) => (
                      <React.Fragment key={`${dayIndex}-${hour}`}>
                        <div 
                          className="border-r border-b border-slate-100/50 hover:bg-slate-50/30 transition-colors"
                          style={{ gridColumn: dayIndex + 2, gridRow: i * 2 + 2 }}
                        />
                        <div 
                          className="border-r border-b border-slate-100/50 hover:bg-slate-50/30 transition-colors border-b-dashed"
                          style={{ gridColumn: dayIndex + 2, gridRow: i * 2 + 3 }}
                        />
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}

                {/* Events */}
                {!isLoading && events.map(event => (
                  <div 
                    key={event.id}
                    className={`m-1 p-2 rounded-xl border shadow-sm flex flex-col gap-1 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${event.color}`}
                    style={getEventStyle(event)}
                  >
                    <div className="font-semibold text-sm leading-tight">{event.title}</div>
                    <div className="flex items-center gap-1 text-xs opacity-80 mt-auto">
                      {event.location === 'Online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-4">
              <CardTitle className="font-display text-xl">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, idx) => (
                  <div key={event.id} className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      {idx === 0 ? 'Today' : 'Tomorrow'}
                    </h4>
                    <div className="group flex gap-4 p-3 rounded-2xl hover:bg-white/60 transition-colors border border-transparent hover:border-slate-200/60 cursor-pointer">
                      <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 ${event.colorLight.replace('bg-', 'bg-').replace('-100', '-50')} ${event.colorText}`}>
                        <span className="text-xs font-bold">{formatHour(event.start).display}</span>
                        <span className="text-[10px] uppercase">{formatHour(event.start).ampm}</span>
                      </div>
                      <div>
                        <p className={`font-medium text-slate-900 transition-colors group-hover:${event.colorText}`}>{event.title}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No upcoming classes.</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-100/50 bg-white/40 pb-4">
              <CardTitle className="font-display text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {[
                { label: 'Lectures', color: 'bg-blue-500' },
                { label: 'Tutorials', color: 'bg-purple-500' },
                { label: 'Labs', color: 'bg-emerald-500' },
                { label: 'Meetings', color: 'bg-amber-500' },
              ].map(filter => (
                <label key={filter.label} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                  <div className={`w-3 h-3 rounded-full ${filter.color}`} />
                  <span className="text-sm font-medium text-slate-700">{filter.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
