import Student from '../models/Student.js';
import { getAnalyticsKPI, getDepartmentPerformance } from './analyticsService.js';

export const parseQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Risk queries
  if (lowerQuery.includes('high risk') || lowerQuery.includes('at-risk') || lowerQuery.includes('at risk')) {
    return { type: 'risk', filter: 'high' };
  }
  if (lowerQuery.includes('medium risk')) {
    return { type: 'risk', filter: 'medium' };
  }
  if (lowerQuery.includes('low risk') || lowerQuery.includes('safe')) {
    return { type: 'risk', filter: 'low' };
  }

  // Department queries
  if (lowerQuery.includes('highest gpa') || lowerQuery.includes('best department')) {
    return { type: 'department', filter: 'best' };
  }
  if (lowerQuery.includes('lowest gpa') || lowerQuery.includes('worst department')) {
    return { type: 'department', filter: 'worst' };
  }

  // Attendance queries
  if (lowerQuery.includes('attendance')) {
    return { type: 'attendance' };
  }

  // Top performers
  if (lowerQuery.includes('top performer') || lowerQuery.includes('best student') || lowerQuery.includes('top 5')) {
    return { type: 'topPerformers' };
  }

  // Total count
  if (lowerQuery.includes('total') || lowerQuery.includes('how many students')) {
    return { type: 'total' };
  }

  // Low risk
  if (lowerQuery.includes('low risk')) {
    return { type: 'risk', filter: 'low' };
  }

  return { type: 'general' };
};

export const generateResponse = async (query) => {
  try {
    const parsedQuery = parseQuery(query);
    const students = await Student.find();
    const kpis = await getAnalyticsKPI();

    let response = '';

    switch (parsedQuery.type) {
      case 'risk': {
        const filtered = students.filter(s => s.riskLevel === parsedQuery.filter);
        if (filtered.length === 0) {
          response = `There are no **${parsedQuery.filter} risk** students in the system.`;
        } else {
          const studentList = filtered.map(s => 
            `- **${s.name}** (${s.department}) — GPA: ${s.gpa}, Attendance: ${s.attendance}%`
          ).join('\n');
          
          response = `There are **${filtered.length} ${parsedQuery.filter} risk** students:\n\n${studentList}`;
          
          if (parsedQuery.filter === 'high') {
            response += '\n\nI recommend immediate academic counseling sessions for these students.';
          }
        }
        break;
      }

      case 'department': {
        const deptPerf = await getDepartmentPerformance();
        if (parsedQuery.filter === 'best') {
          const best = deptPerf.sort((a, b) => b.avgGpa - a.avgGpa)[0];
          response = `**${best.department}** leads with the highest average GPA of **${best.avgGpa}** across ${best.studentCount} students.`;
        } else {
          const worst = deptPerf.sort((a, b) => a.avgGpa - b.avgGpa)[0];
          response = `**${worst.department}** has the lowest average GPA of **${worst.avgGpa}** across ${worst.studentCount} students. Additional support may be needed.`;
        }
        break;
      }

      case 'attendance': {
        const lowAttendance = students.filter(s => s.attendance < 70);
        response = `The institution-wide average attendance is **${kpis.avgAttendance}%**.\n\n`;
        response += `${lowAttendance.length} students have attendance below 70% and require immediate attention.`;
        break;
      }

      case 'topPerformers': {
        const top = students.sort((a, b) => b.gpa - a.gpa).slice(0, 5);
        const list = top.map((s, i) => `${i + 1}. **${s.name}** — GPA: ${s.gpa}, ${s.department}`).join('\n');
        response = `**Top 5 Performers:**\n\n${list}\n\nThese students demonstrate exceptional academic consistency.`;
        break;
      }

      case 'total': {
        response = `There are currently **${kpis.totalStudents} students** enrolled across 5 departments, with an average GPA of **${kpis.avgGpa}**.`;
        break;
      }

      default: {
        response = `I can help you analyze student academic data. Try asking about:\n\n- **Risk classifications** (high, medium, low)\n- **Department comparisons**\n- **Top performers**\n- **Attendance trends**\n- **Overall statistics**\n\nWhat would you like to know?`;
      }
    }

    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, I encountered an error processing your query. Please try again.';
  }
};
