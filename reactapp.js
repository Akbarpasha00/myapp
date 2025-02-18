// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import * as echarts from 'echarts';
import axios from 'axios';
const App: React.FC = () => {
const [activeTab, setActiveTab] = useState('dashboard');
const [whatsappMessage, setWhatsappMessage] = useState('');
const [selectedTemplate, setSelectedTemplate] = useState('');
const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
const [emailStatus, setEmailStatus] = useState<string>('');
const sendMauticEmail = async (recipients: string[], templateId: string, subject: string) => {
try {
const mauticApiUrl = 'https://your-mautic-instance/api/emails/send';
const mauticApiKey = 'your-mautic-api-key';
const response = await axios.post(mauticApiUrl, {
email: templateId,
subject: subject,
recipients: recipients,
}, {
headers: {
'Authorization': `Bearer ${mauticApiKey}`,
'Content-Type': 'application/json'
}
});
if (response.status === 200) {
setEmailStatus('Email sent successfully');
return true;
} else {
setEmailStatus('Failed to send email');
return false;
}
} catch (error) {
setEmailStatus('Error sending email');
console.error('Mautic email error:', error);
return false;
}
};
const sendBulkEmails = async (studentList: any[], templateId: string, subject: string) => {
const emailList = studentList.map(student => student.email);
const success = await sendMauticEmail(emailList, templateId, subject);
return success;
};
const notifyEligibleStudents = async (companyName: string) => {
const eligibleStudents = filteredStudents.filter(student => student.btechPercentage >= 70);
const templateId = 'eligible-notification-template';
const emailSubject = `New Job Opportunity at ${companyName}`;
const success = await sendBulkEmails(eligibleStudents, templateId, emailSubject);
if (success) {
setEmailStatus(`Notification sent to ${eligibleStudents.length} eligible students`);
}
};
const [showAddStudent, setShowAddStudent] = useState(false);
const [showAddCompany, setShowAddCompany] = useState(false);
const [companyQuestions, setCompanyQuestions] = useState([{ id: 1, question: '', answer: '' }]);
const [codingQuestions, setCodingQuestions] = useState([{
id: 1,
title: '',
description: '',
sampleInput: '',
sampleOutput: '',
solution: ''
}]);
const addCompanyQuestion = () => {
const newId = companyQuestions.length + 1;
setCompanyQuestions([...companyQuestions, { id: newId, question: '', answer: '' }]);
};
const removeCompanyQuestion = (id: number) => {
setCompanyQuestions(companyQuestions.filter(q => q.id !== id));
};
const addCodingQuestion = () => {
const newId = codingQuestions.length + 1;
setCodingQuestions([...codingQuestions, {
id: newId,
title: '',
description: '',
sampleInput: '',
sampleOutput: '',
solution: ''
}]);
};
const removeCodingQuestion = (id: number) => {
setCodingQuestions(codingQuestions.filter(q => q.id !== id));
};
const [showDownloadModal, setShowDownloadModal] = useState(false);
const [downloadType, setDownloadType] = useState('');
const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCompany, setSelectedCompany] = useState('');
const [selectedBranch, setSelectedBranch] = useState('');
const [selectedCGPA, setSelectedCGPA] = useState('');
const studentColumns = [
{ id: 'name', label: 'Name' },
{ id: 'email', label: 'Email' },
{ id: 'rollNo', label: 'Roll No' },
{ id: 'branch', label: 'Branch' },
{ id: 'btechPercentage', label: 'BTech %' },
{ id: 'status', label: 'Status' }
];
const handleDownload = (type: string) => {
setDownloadType(type);
setSelectedColumns(studentColumns.map(col => col.id));
setShowDownloadModal(true);
};
const handleConfirmDownload = async () => {
let dataToExport = [];
if (downloadType === 'students') {
dataToExport = filteredStudents.map(student => {
const exportObj: { [key: string]: any } = {};
selectedColumns.forEach(col => {
exportObj[col] = student[col as keyof typeof student];
});
return exportObj;
});
} else if (downloadType === 'eligible') {
dataToExport = filteredStudents
.filter(student => student.btechPercentage >= 70)
.map(student => {
const exportObj: { [key: string]: any } = {};
selectedColumns.forEach(col => {
exportObj[col] = student[col as keyof typeof student];
});
return exportObj;
});
}
const csvContent = convertToCSV(dataToExport);
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
const url = URL.createObjectURL(blob);
link.setAttribute('href', url);
link.setAttribute('download', `${downloadType}_${new Date().toISOString()}.csv`);
link.style.visibility = 'hidden';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
setShowDownloadModal(false);
// Send email notification about the download
if (downloadType === 'students' || downloadType === 'eligible') {
const templateId = 'data-export-notification';
const subject = `${downloadType.charAt(0).toUpperCase() + downloadType.slice(1)} Data Export Notification`;
await sendMauticEmail(['admin@university.edu'], templateId, subject);
}
};
const convertToCSV = (data: any[]) => {
if (data.length === 0) return '';
const headers = selectedColumns.map(col =>
studentColumns.find(c => c.id === col)?.label || col
).join(',');
const rows = data.map(obj =>
selectedColumns.map(col => {
let value = obj[col];
if (typeof value === 'string' && value.includes(',')) {
value = `"${value}"`;
}
return value;
}).join(',')
);
return [headers, ...rows].join('\n');
};
const swiperModules = [Pagination, Autoplay];
const students = [
{
name: 'Alexander Mitchell',
email: 'alexander.m@university.edu',
rollNo: 'CS2025001',
branch: 'Computer Science',
btechPercentage: 92,
status: 'Placed',
mobile: '+91 9876543210',
gender: 'Male',
assignedTPO: 'Dr. Sarah Wilson',
yearOfPassout: '2025',
graduationPercentage: 92,
collegeName: 'Tech University',
interDiplomaPercentage: 88,
previousCollegeName: 'City College',
sscPercentage: 85,
schoolName: 'Global School',
panCardNo: 'ABCDE1234F',
aadharCardNo: '1234 5678 9012'
},
{
name: 'Isabella Thompson',
email: 'isabella.t@university.edu',
rollNo: 'CS2025002',
branch: 'Computer Science',
btechPercentage: 88,
status: 'Interview'
},
{
name: 'William Anderson',
email: 'william.a@university.edu',
rollNo: 'EC2025001',
branch: 'Electronics',
btechPercentage: 85,
status: 'Eligible'
},
{
name: 'Sophia Rodriguez',
email: 'sophia.r@university.edu',
rollNo: 'ME2025001',
branch: 'Mechanical',
btechPercentage: 87,
status: 'Placed'
},
{
name: 'Benjamin Clarke',
email: 'benjamin.c@university.edu',
rollNo: 'CS2025003',
branch: 'Computer Science',
btechPercentage: 90,
status: 'Interview'
}
];
const companies = [
{
name: 'TechCorp Solutions',
driveDate: '2025-03-15',
package: '₹18 LPA',
openPositions: 25,
minCriteria: 'BTech 70% or above, No active backlogs'
},
{
name: 'Global Systems Inc',
driveDate: '2025-03-20',
package: '₹22 LPA',
openPositions: 15,
minCriteria: 'BTech 75% or above, No backlogs'
},
{
name: 'Innovation Labs',
driveDate: '2025-03-25',
package: '₹16 LPA',
openPositions: 30,
minCriteria: 'BTech 65% or above, Maximum 1 backlog'
},
{
name: 'Future Technologies',
driveDate: '2025-04-01',
package: '₹20 LPA',
openPositions: 20,
minCriteria: 'BTech 70% or above, No backlogs'
},
{
name: 'Digital Solutions',
driveDate: '2025-04-05',
package: '₹15 LPA',
openPositions: 35,
minCriteria: 'BTech 60% or above, Maximum 2 backlogs'
}
];
// Removed duplicate students array definition
// Removed duplicate companies array definition
const handleExportExcel = () => {
// Here you would implement the Excel export logic
console.log('Exporting to Excel...');
};
const handleExportPDF = () => {
// Here you would implement the PDF export logic
console.log('Exporting to PDF...');
};
const filteredStudents = students.filter(student => {
const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
const matchesBranch = !selectedBranch || student.branch === selectedBranch;
const matchesCGPA = !selectedCGPA || (
selectedCGPA === '9-10' ? student.btechPercentage >= 90 :
selectedCGPA === '8-9' ? student.btechPercentage >= 80 && student.btechPercentage < 90 :
selectedCGPA === '7-8' ? student.btechPercentage >= 70 && student.btechPercentage < 80 :
selectedCGPA === '6-7' ? student.btechPercentage >= 60 && student.btechPercentage < 70 : true
);
return matchesSearch && matchesBranch && matchesCGPA;
});
// Removed duplicate students array definition
// Removed duplicate companies array definition
useEffect(() => {
const chartDom = document.getElementById('placementChart');
if (chartDom) {
const myChart = echarts.init(chartDom);
const option = {
animation: false,
tooltip: {
trigger: 'axis'
},
legend: {
data: ['Placed', 'Total Students']
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: {
type: 'category',
data: ['CSE', 'ECE', 'ME', 'CE', 'IT']
},
yAxis: {
type: 'value'
},
series: [
{
name: 'Placed',
type: 'bar',
data: [150, 120, 90, 80, 110],
color: '#4CAF50'
},
{
name: 'Total Students',
type: 'bar',
data: [180, 150, 120, 100, 140],
color: '#2196F3'
}
]
};
myChart.setOption(option);
}
}, []);
return (
<div className="min-h-screen bg-gray-50">
{/* Sidebar */}
<div className="fixed left-0 top-0 h-full w-64 bg-[#1a237e] text-white p-5 z-40">
<div className="mb-8">
<h1 className="text-2xl font-bold">PlacementCMS</h1>
</div>
<nav>
<button
onClick={() => setActiveTab('dashboard')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fas fa-chart-line mr-3"></i>Dashboard
</button>
<button
onClick={() => setActiveTab('students')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'students' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fas fa-user-graduate mr-3"></i>Students
</button>
<button
onClick={() => setActiveTab('companies')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'companies' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fas fa-building mr-3"></i>Companies
</button>
<button
onClick={() => setActiveTab('eligibility')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'eligibility' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fas fa-check-circle mr-3"></i>Eligibility
</button>
<button
onClick={() => setActiveTab('tpo')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'tpo' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fas fa-users mr-3"></i>TPO Team
</button>
<button
onClick={() => setActiveTab('whatsapp')}
className={`w-full text-left p-3 mb-2 rounded-lg ${activeTab === 'whatsapp' ? 'bg-white/20' : 'hover:bg-white/10'} !rounded-button whitespace-nowrap`}
>
<i className="fab fa-whatsapp mr-3"></i>WhatsApp
</button>
</nav>
</div>
{/* Main Content */}
<div className="ml-64 p-8">
{/* Header */}
<div className="flex justify-between items-center mb-8">
<h2 className="text-2xl font-bold text-gray-800">
{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
</h2>
<div className="flex items-center gap-4">
<button className="bg-gray-200 p-2 rounded-full">
<i className="fas fa-bell text-gray-600"></i>
</button>
<div className="flex items-center gap-2">
<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
<i className="fas fa-user"></i>
</div>
<span className="text-gray-700">Admin</span>
</div>
</div>
</div>
{/* Dashboard Content */}
{activeTab === 'dashboard' && (
<div>
<div className="grid grid-cols-4 gap-6 mb-8">
<div className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-center mb-4">
<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
<i className="fas fa-user-graduate text-blue-500 text-xl"></i>
</div>
<span className="text-green-500">+12%</span>
</div>
<h3 className="text-gray-500 text-sm">Total Students</h3>
<p className="text-2xl font-bold">2,450</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-center mb-4">
<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
<i className="fas fa-building text-green-500 text-xl"></i>
</div>
<span className="text-green-500">+8%</span>
</div>
<h3 className="text-gray-500 text-sm">Active Companies</h3>
<p className="text-2xl font-bold">35</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-center mb-4">
<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
<i className="fas fa-briefcase text-purple-500 text-xl"></i>
</div>
<span className="text-green-500">+15%</span>
</div>
<h3 className="text-gray-500 text-sm">Placed Students</h3>
<p className="text-2xl font-bold">550</p>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-center mb-4">
<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
<i className="fas fa-calendar-alt text-yellow-500 text-xl"></i>
</div>
<span className="text-yellow-500">+5</span>
</div>
<h3 className="text-gray-500 text-sm">Upcoming Drives</h3>
<p className="text-2xl font-bold">8</p>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold mb-4">Placement Statistics</h3>
<div id="placementChart" style={{ height: '400px' }}></div>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold mb-4">Upcoming Placement Drives</h3>
<div className="space-y-4">
{companies.map((company, index) => (
<div key={index} className="flex items-center justify-between p-4 border rounded-lg">
<div>
<h4 className="font-semibold">{company.name}</h4>
<p className="text-sm text-gray-500">Drive Date: {company.driveDate}</p>
</div>
<div className="text-right">
<p className="font-semibold text-green-600">{company.package}</p>
<p className="text-sm text-gray-500">{company.openPositions} Positions</p>
</div>
</div>
))}
</div>
</div>
</div>
</div>
)}
{/* Students Content */}
{activeTab === 'students' && (
<div>
<div className="flex justify-between items-center mb-6">
<div className="flex gap-4">
<div className="relative">
<input
type="text"
placeholder="Search students..."
className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
/>
<i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
<option>All Branches</option>
<option>Computer Science</option>
<option>Electronics</option>
<option>Mechanical</option>
</select>
</div>
<div className="flex gap-3">
<label className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer !rounded-button whitespace-nowrap">
<i className="fas fa-file-excel mr-2"></i>Bulk Upload
<input
type="file"
accept=".xlsx,.xls"
className="hidden"
onChange={(e) => {
if (e.target.files && e.target.files[0]) {
// Handle file upload logic here
console.log('File selected:', e.target.files[0].name);
}
}}
/>
</label>
<button
onClick={() => handleDownload('students')}
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap"
>
<i className="fas fa-download mr-2"></i>Download
</button>
<button
onClick={() => setShowAddStudent(true)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap"
>
<i className="fas fa-plus mr-2"></i>Add Student
</button>
</div>
</div>
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
<table className="w-full">
<thead className="bg-gray-50">
<tr>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Roll No</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Branch</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">BTech %</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{filteredStudents.map((student, index) => (
<tr key={index}>
<td className="px-6 py-4">
<div className="flex items-center">
<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
<span className="text-blue-600 font-semibold">
{student.name.charAt(0)}
</span>
</div>
<div>
<div className="font-medium text-gray-900">{student.name}</div>
<div className="text-sm text-gray-500">{student.email}</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.rollNo}</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.branch}</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.btechPercentage}%</td>
<td className="px-6 py-4">
<span className={`px-2 py-1 text-xs rounded-full ${
student.status === 'Placed' ? 'bg-green-100 text-green-800' :
student.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
'bg-blue-100 text-blue-800'
}`}>
{student.status}
</span>
</td>
<td className="px-6 py-4">
<button className="text-blue-600 hover:text-blue-800 mr-3">
<i className="fas fa-edit"></i>
</button>
<button className="text-red-600 hover:text-red-800">
<i className="fas fa-trash"></i>
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)}
{/* Companies Content */}
{activeTab === 'companies' && (
<div>
<div className="flex justify-between items-center mb-6">
<div className="relative">
<input
type="text"
placeholder="Search companies..."
className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
/>
<i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<button
onClick={() => setShowAddCompany(true)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap"
>
<i className="fas fa-plus mr-2"></i>Add Company
</button>
</div>
<div className="grid grid-cols-3 gap-6">
{companies.map((company, index) => (
<div key={index} className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-start mb-4">
<div>
<h3 className="text-xl font-bold">{company.name}</h3>
<p className="text-gray-500">Drive Date: {company.driveDate}</p>
</div>
<div className="flex gap-2">
<button className="text-blue-600 hover:text-blue-800">
<i className="fas fa-edit"></i>
</button>
<button className="text-red-600 hover:text-red-800">
<i className="fas fa-trash"></i>
</button>
</div>
</div>
<div className="space-y-3">
<div className="flex justify-between">
<span className="text-gray-500">Package:</span>
<span className="font-semibold text-green-600">{company.package}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-500">Positions:</span>
<span className="font-semibold">{company.openPositions}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-500">Min Criteria:</span>
<span className="font-semibold">{company.minCriteria}</span>
</div>
</div>
<button className="mt-4 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 !rounded-button whitespace-nowrap">
View Details
</button>
</div>
))}
</div>
</div>
)}
{/* Eligibility Content */}
{activeTab === 'tpo' && (
<div>
<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">TPO Team Members</h3>
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap">
<i className="fas fa-plus mr-2"></i>Add TPO Member
</button>
</div>
<div className="grid grid-cols-3 gap-6">
<div className="bg-white border rounded-lg p-6">
<div className="flex items-center mb-4">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-user-tie text-blue-600 text-2xl"></i>
</div>
<div>
<h4 className="text-lg font-semibold">Dr. Sarah Wilson</h4>
<p className="text-gray-500">Student Queries</p>
</div>
</div>
<div className="space-y-2">
<div className="flex items-center">
<i className="fas fa-envelope text-gray-400 w-5 mr-2"></i>
<span className="text-sm">sarah.wilson@university.edu</span>
</div>
<div className="flex items-center">
<i className="fas fa-phone text-gray-400 w-5 mr-2"></i>
<span className="text-sm">+91 98765 43210</span>
</div>
<div className="flex items-center">
<i className="fas fa-user-graduate text-gray-400 w-5 mr-2"></i>
<span className="text-sm">125 Students Assigned</span>
</div>
</div>
<div className="mt-4 flex gap-2">
<button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 !rounded-button whitespace-nowrap">
<i className="fas fa-edit mr-2"></i>Edit
</button>
<button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 !rounded-button whitespace-nowrap">
<i className="fas fa-trash mr-2"></i>Remove
</button>
</div>
</div>
<div className="bg-white border rounded-lg p-6">
<div className="flex items-center mb-4">
<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-user-tie text-green-600 text-2xl"></i>
</div>
<div>
<h4 className="text-lg font-semibold">Prof. James Anderson</h4>
<p className="text-gray-500">Company Queries</p>
</div>
</div>
<div className="space-y-2">
<div className="flex items-center">
<i className="fas fa-envelope text-gray-400 w-5 mr-2"></i>
<span className="text-sm">james.anderson@university.edu</span>
</div>
<div className="flex items-center">
<i className="fas fa-phone text-gray-400 w-5 mr-2"></i>
<span className="text-sm">+91 98765 43211</span>
</div>
<div className="flex items-center">
<i className="fas fa-building text-gray-400 w-5 mr-2"></i>
<span className="text-sm">15 Companies Managed</span>
</div>
</div>
<div className="mt-4 flex gap-2">
<button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 !rounded-button whitespace-nowrap">
<i className="fas fa-edit mr-2"></i>Edit
</button>
<button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 !rounded-button whitespace-nowrap">
<i className="fas fa-trash mr-2"></i>Remove
</button>
</div>
</div>
<div className="bg-white border rounded-lg p-6">
<div className="flex items-center mb-4">
<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-user-tie text-purple-600 text-2xl"></i>
</div>
<div>
<h4 className="text-lg font-semibold">Dr. Emily Parker</h4>
<p className="text-gray-500">Other Queries</p>
</div>
</div>
<div className="space-y-2">
<div className="flex items-center">
<i className="fas fa-envelope text-gray-400 w-5 mr-2"></i>
<span className="text-sm">emily.parker@university.edu</span>
</div>
<div className="flex items-center">
<i className="fas fa-phone text-gray-400 w-5 mr-2"></i>
<span className="text-sm">+91 98765 43212</span>
</div>
<div className="flex items-center">
<i className="fas fa-tasks text-gray-400 w-5 mr-2"></i>
<span className="text-sm">General Administration</span>
</div>
</div>
<div className="mt-4 flex gap-2">
<button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 !rounded-button whitespace-nowrap">
<i className="fas fa-edit mr-2"></i>Edit
</button>
<button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 !rounded-button whitespace-nowrap">
<i className="fas fa-trash mr-2"></i>Remove
</button>
</div>
</div>
</div>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<h3 className="text-xl font-bold mb-6">Recent Activities</h3>
<div className="space-y-4">
<div className="flex items-center p-4 border rounded-lg">
<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-user-plus text-blue-600"></i>
</div>
<div>
<p className="font-medium">Dr. Sarah Wilson assigned 15 new students</p>
<p className="text-sm text-gray-500">2 hours ago</p>
</div>
</div>
<div className="flex items-center p-4 border rounded-lg">
<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-building text-green-600"></i>
</div>
<div>
<p className="font-medium">Prof. James Anderson added TechCorp Solutions</p>
<p className="text-sm text-gray-500">5 hours ago</p>
</div>
</div>
<div className="flex items-center p-4 border rounded-lg">
<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
<i className="fas fa-file-alt text-purple-600"></i>
</div>
<div>
<p className="font-medium">Dr. Emily Parker updated placement guidelines</p>
<p className="text-sm text-gray-500">1 day ago</p>
</div>
</div>
</div>
</div>
</div>
)}
{activeTab === 'eligibility' && (
<div>
<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
<div className="flex justify-between items-center mb-4">
<h3 className="text-xl font-bold">Eligibility Criteria</h3>
<div className="flex gap-3">
<button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap">
<i className="fas fa-file-excel mr-2"></i>Export Excel
</button>
<button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 !rounded-button whitespace-nowrap">
<i className="fas fa-file-pdf mr-2"></i>Export PDF
</button>
</div>
</div>
<div className="grid grid-cols-4 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>All Branches</option>
<option>Computer Science</option>
<option>Electronics</option>
<option>Mechanical</option>
</select>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Min BTech %</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
placeholder="Enter percentage"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Backlogs</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>No Backlogs</option>
<option>Maximum 1</option>
<option>Maximum 2</option>
</select>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>2025</option>
<option>2024</option>
<option>2023</option>
</select>
</div>
</div>
<div className="flex gap-4 mt-4">
<button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap">
Check Eligibility
</button>
<button
onClick={() => notifyEligibleStudents('TechCorp Solutions')}
className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap"
>
<i className="fas fa-envelope mr-2"></i>
Notify Eligible Students
</button>
</div>
{emailStatus && (
<div className={`mt-4 p-3 rounded-lg ${
emailStatus.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
}`}>
<i className={`fas ${
emailStatus.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'
} mr-2`}></i>
{emailStatus}
</div>
)}
</div>
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
<div className="p-4 border-b">
<div className="flex justify-between items-center">
<h3 className="text-lg font-semibold">Eligible Students</h3>
<div className="flex gap-4">
<button
onClick={() => handleDownload('eligible')}
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap"
>
<i className="fas fa-download mr-2"></i>Download Eligible
</button>
<div className="relative">
<input
type="text"
placeholder="Search students..."
className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
/>
<i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
<option value="">All Companies</option>
<option value="TechCorp Solutions">TechCorp Solutions</option>
<option value="Global Systems Inc">Global Systems Inc</option>
<option value="Innovation Labs">Innovation Labs</option>
</select>
<select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
<option value="">All Branches</option>
<option value="Computer Science">Computer Science</option>
<option value="Electronics">Electronics</option>
<option value="Mechanical">Mechanical</option>
</select>
<select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
<option value="">CGPA Range</option>
<option value="9-10">9.0 - 10.0</option>
<option value="8-9">8.0 - 9.0</option>
<option value="7-8">7.0 - 8.0</option>
<option value="6-7">6.0 - 7.0</option>
</select>
</div>
</div>
</div>
<table className="w-full">
<thead className="bg-gray-50">
<tr>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Roll No</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Branch</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">BTech %</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Backlogs</th>
<th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{filteredStudents.map((student, index) => (
<tr key={index}>
<td className="px-6 py-4">
<div className="flex items-center">
<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
<span className="text-blue-600 font-semibold">
{student.name.charAt(0)}
</span>
</div>
<div>
<div className="font-medium text-gray-900">{student.name}</div>
<div className="text-sm text-gray-500">{student.email}</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.rollNo}</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.branch}</td>
<td className="px-6 py-4 text-sm text-gray-500">{student.btechPercentage}%</td>
<td className="px-6 py-4 text-sm text-gray-500">0</td>
<td className="px-6 py-4">
<button className="text-blue-600 hover:text-blue-800">
View Details
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)}
</div>
{/* Add Student Modal */}
{showAddStudent && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg w-[800px] p-6 max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">Add New Student</h3>
<button onClick={() => setShowAddStudent(false)}>
<i className="fas fa-times"></i>
</button>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="col-span-2 mb-4">
<h4 className="text-lg font-semibold text-blue-600 mb-2">Personal Information</h4>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter full name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
<input
type="email"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter email"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
<input
type="tel"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter mobile number"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>Select Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>
</select>
</div>
</div>
</div>
<div className="col-span-2 mb-4">
<h4 className="text-lg font-semibold text-blue-600 mb-2">Academic Information</h4>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter roll number"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>Select Branch</option>
<option>Computer Science</option>
<option>Electronics</option>
<option>Mechanical</option>
</select>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Year of Passout</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter passout year"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Graduation %</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter graduation percentage"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter college name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Inter/Diploma %</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
placeholder="Enter percentage"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Previous College Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter previous college name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">SSC %</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter SSC percentage"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter school name"
/>
</div>
</div>
</div>
<div className="col-span-2 mb-4">
<h4 className="text-lg font-semibold text-blue-600 mb-2">Documents & TPO Details</h4>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">PAN Card No</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter PAN card number"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card No</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter Aadhar card number"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Assigned TPO Member</label>
<select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10">
<option>Select TPO Member</option>
<option>Dr. Sarah Wilson - Student Queries</option>
<option>Prof. James Anderson - Company Queries</option>
<option>Dr. Emily Parker - Other Queries</option>
</select>
</div>
</div>
</div>
</div>
<div className="mt-6 flex justify-end gap-4">
<button
onClick={() => setShowAddStudent(false)}
className="px-4 py-2 border rounded-lg hover:bg-gray-50 !rounded-button whitespace-nowrap"
>
Cancel
</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap">
Add Student
</button>
</div>
</div>
</div>
)}
{/* Download Modal */}
{showDownloadModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg w-[500px] p-6">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">Select Columns to Download</h3>
<button onClick={() => setShowDownloadModal(false)}>
<i className="fas fa-times"></i>
</button>
</div>
<div className="space-y-3 mb-6">
{studentColumns.map((column) => (
<div key={column.id} className="flex items-center">
<input
type="checkbox"
id={column.id}
checked={selectedColumns.includes(column.id)}
onChange={(e) => {
if (e.target.checked) {
setSelectedColumns([...selectedColumns, column.id]);
} else {
setSelectedColumns(selectedColumns.filter(col => col !== column.id));
}
}}
className="mr-3"
/>
<label htmlFor={column.id}>{column.label}</label>
</div>
))}
</div>
<div className="flex justify-end gap-4">
<button
onClick={() => setShowDownloadModal(false)}
className="px-4 py-2 border rounded-lg hover:bg-gray-50 !rounded-button whitespace-nowrap"
>
Cancel
</button>
<button
onClick={handleConfirmDownload}
className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap"
disabled={selectedColumns.length === 0}
>
Download
</button>
</div>
</div>
</div>
)}
{/* Add Company Modal */}
{showAddCompany && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white rounded-lg w-[600px] p-6">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">Add New Company</h3>
<button onClick={() => setShowAddCompany(false)}>
<i className="fas fa-times"></i>
</button>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter company name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Open Positions</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter number of positions"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Job Position Name</label>
<input
type="text"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter job position name"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Eligible Year of Passedouts</label>
<div className="flex flex-wrap gap-2">
{['2023', '2024', '2025'].map((year) => (
<label className="flex items-center space-x-2">
<input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
<span>{year}</span>
</label>
))}
</div>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Eligible Branches</label>
<div className="flex flex-wrap gap-2">
{['CSE', 'ECE', 'ME', 'CE', 'IT'].map((branch) => (
<label className="flex items-center space-x-2">
<input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
<span>{branch}</span>
</label>
))}
</div>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Eligible Gender</label>
<div className="flex gap-4">
{['Male', 'Female', 'Other'].map((gender) => (
<label className="flex items-center space-x-2">
<input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
<span>{gender}</span>
</label>
))}
</div>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Eligible Percentage</label>
<input
type="number"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter minimum percentage required"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Application Link</label>
<input
type="url"
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter application URL"
/>
</div>
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
<textarea
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter detailed job description"
rows={4}
></textarea>
</div>
<div className="col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">HR Details</label>
<div className="grid grid-cols-2 gap-4">
<input
type="text"
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="HR Name"
/>
<input
type="email"
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="HR Email"
/>
<input
type="tel"
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="HR Phone"
/>
<input
type="text"
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="HR Designation"
/>
</div>
</div>
<div className="col-span-2 mt-6">
<label className="block text-lg font-semibold text-blue-600 mb-4">Company Specific Questions</label>
<div className="space-y-4">
{companyQuestions.map((q) => (
<div key={q.id} className="p-4 border rounded-lg">
<div className="flex justify-between items-start mb-3">
<label className="block text-sm font-medium text-gray-700">Question {q.id}</label>
<button
onClick={() => removeCompanyQuestion(q.id)}
className="text-red-600 hover:text-red-800">
<i className="fas fa-trash"></i>
</button>
</div>
<input
type="text"
value={q.question}
onChange={(e) => {
const updated = companyQuestions.map(item =>
item.id === q.id ? { ...item, question: e.target.value } : item
);
setCompanyQuestions(updated);
}}
className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-blue-500"
placeholder="Enter question"
/>
<textarea
value={q.answer}
onChange={(e) => {
const updated = companyQuestions.map(item =>
item.id === q.id ? { ...item, answer: e.target.value } : item
);
setCompanyQuestions(updated);
}}
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter answer"
rows={2}
></textarea>
</div>
))}
</div>
<button
onClick={addCompanyQuestion}
className="mt-2 text-blue-600 hover:text-blue-800">
<i className="fas fa-plus mr-2"></i>Add Another Question
</button>
</div>
<div className="col-span-2 mt-6">
<label className="block text-lg font-semibold text-blue-600 mb-4">Coding Questions</label>
<div className="space-y-4">
{codingQuestions.map((q) => (
<div key={q.id} className="p-4 border rounded-lg">
<div className="flex justify-between items-start mb-3">
<label className="block text-sm font-medium text-gray-700">Coding Question {q.id}</label>
<button
onClick={() => removeCodingQuestion(q.id)}
className="text-red-600 hover:text-red-800">
<i className="fas fa-trash"></i>
</button>
</div>
<input
type="text"
value={q.title}
onChange={(e) => {
const updated = codingQuestions.map(item =>
item.id === q.id ? { ...item, title: e.target.value } : item
);
setCodingQuestions(updated);
}}
className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-blue-500"
placeholder="Enter question title"
/>
<textarea
value={q.description}
onChange={(e) => {
const updated = codingQuestions.map(item =>
item.id === q.id ? { ...item, description: e.target.value } : item
);
setCodingQuestions(updated);
}}
className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-blue-500"
placeholder="Enter question description"
rows={3}
></textarea>
<div className="grid grid-cols-2 gap-4 mb-2">
<input
type="text"
value={q.sampleInput}
onChange={(e) => {
const updated = codingQuestions.map(item =>
item.id === q.id ? { ...item, sampleInput: e.target.value } : item
);
setCodingQuestions(updated);
}}
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Sample Input"
/>
<input
type="text"
value={q.sampleOutput}
onChange={(e) => {
const updated = codingQuestions.map(item =>
item.id === q.id ? { ...item, sampleOutput: e.target.value } : item
);
setCodingQuestions(updated);
}}
className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Sample Output"
/>
</div>
<textarea
value={q.solution}
onChange={(e) => {
const updated = codingQuestions.map(item =>
item.id === q.id ? { ...item, solution: e.target.value } : item
);
setCodingQuestions(updated);
}}
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
placeholder="Enter solution code"
rows={4}
></textarea>
</div>
))}
</div>
<button
onClick={addCodingQuestion}
className="mt-2 text-blue-600 hover:text-blue-800">
<i className="fas fa-plus mr-2"></i>Add Another Coding Question
</button>
</div>
</div>
<div className="mt-6 flex justify-end gap-4">
<button
onClick={() => setShowAddCompany(false)}
className="px-4 py-2 border rounded-lg hover:bg-gray-50 !rounded-button whitespace-nowrap"
>
Cancel
</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 !rounded-button whitespace-nowrap">
Add Company
</button>
</div>
</div>
</div>
)}
{activeTab === 'whatsapp' && (
<div>
<div className="bg-white p-6 rounded-lg shadow-sm mb-6">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">WhatsApp Communication</h3>
<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 !rounded-button whitespace-nowrap">
<i className="fab fa-whatsapp mr-2"></i>Send Bulk Messages
</button>
</div>
<div className="grid grid-cols-2 gap-6">
<div>
<h4 className="text-lg font-semibold mb-4">Message Templates</h4>
<div className="space-y-4">
<div className="border rounded-lg p-4 cursor-pointer hover:border-green-500">
<div className="flex justify-between items-start mb-2">
<h5 className="font-medium">Placement Drive Notification</h5>
<span className="text-green-600">
<i className="fas fa-check-circle"></i>
</span>
</div>
<p className="text-gray-600 text-sm">Hello {'{student_name}'}, A new placement drive for {'{company_name}'} is scheduled on {'{drive_date}'}. Package: {'{package}'}</p>
</div>
<div className="border rounded-lg p-4 cursor-pointer hover:border-green-500">
<div className="flex justify-between items-start mb-2">
<h5 className="font-medium">Interview Reminder</h5>
<span className="text-green-600">
<i className="fas fa-check-circle"></i>
</span>
</div>
<p className="text-gray-600 text-sm">Hi {'{student_name}'}, This is a reminder for your interview with {'{company_name}'} scheduled at {'{interview_time}'}</p>
</div>
<div className="border rounded-lg p-4 cursor-pointer hover:border-green-500">
<div className="flex justify-between items-start mb-2">
<h5 className="font-medium">Document Submission</h5>
<span className="text-green-600">
<i className="fas fa-check-circle"></i>
</span>
</div>
<p className="text-gray-600 text-sm">Dear {'{student_name}'}, Please submit your {'{document_type}'} by {'{deadline}'} for the placement process</p>
</div>
</div>
</div>
<div>
<h4 className="text-lg font-semibold mb-4">Custom Message</h4>
<div className="space-y-4">
<textarea
value={whatsappMessage}
onChange={(e) => setWhatsappMessage(e.target.value)}
className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
placeholder="Type your message here..."
rows={4}
></textarea>
<div className="flex gap-2 flex-wrap">
<button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
{'{student_name}'}
</button>
<button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
{'{company_name}'}
</button>
<button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
{'{drive_date}'}
</button>
<button className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
{'{package}'}
</button>
</div>
</div>
</div>
</div>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-bold">Message History</h3>
<div className="flex gap-4">
<div className="relative">
<input
type="text"
placeholder="Search messages..."
className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
/>
<i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-green-500">
<option>All Templates</option>
<option>Placement Drive</option>
<option>Interview Reminder</option>
<option>Document Submission</option>
</select>
</div>
</div>
<div className="space-y-4">
<div className="border rounded-lg p-4">
<div className="flex justify-between items-start mb-2">
<div>
<h5 className="font-medium">Placement Drive Notification</h5>
<p className="text-sm text-gray-500">Sent to 45 recipients • 2 hours ago</p>
</div>
<span className="text-green-600">
<i className="fas fa-check-double"></i>
</span>
</div>
<p className="text-gray-600">Hello students, A new placement drive for TechCorp Solutions is scheduled on March 15, 2025. Package: ₹18 LPA</p>
</div>
<div className="border rounded-lg p-4">
<div className="flex justify-between items-start mb-2">
<div>
<h5 className="font-medium">Interview Reminder</h5>
<p className="text-sm text-gray-500">Sent to 12 recipients • 5 hours ago</p>
</div>
<span className="text-green-600">
<i className="fas fa-check-double"></i>
</span>
</div>
<p className="text-gray-600">Hi students, This is a reminder for your interview with Global Systems Inc scheduled at 10:00 AM tomorrow</p>
</div>
<div className="border rounded-lg p-4">
<div className="flex justify-between items-start mb-2">
<div>
<h5 className="font-medium">Document Submission</h5>
<p className="text-sm text-gray-500">Sent to 28 recipients • 1 day ago</p>
</div>
<span className="text-green-600">
<i className="fas fa-check-double"></i>
</span>
</div>
<p className="text-gray-600">Dear students, Please submit your updated resume by February 20, 2025 for the upcoming placement process</p>
</div>
</div>
</div>
</div>
)}
</div>
);
};
export default App;
// end
