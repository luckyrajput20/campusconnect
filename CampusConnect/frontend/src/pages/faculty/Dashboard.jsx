import { useQuery } from "react-query"
import Layout from "../../components/Layout"
import LoadingSpinner from "../../components/LoadingSpinner"
import api from "../../services/api"
import { BookOpen, Users, ClipboardList, Bell } from "lucide-react"

const FacultyDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    "faculty-dashboard",
    () => api.get("/faculty/dashboard").then((res) => res.data),
    { refetchInterval: 30000 },
  )

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <LoadingSpinner size="lg" className="min-h-96" />
      </Layout>
    )
  }

  const stats = dashboardData?.stats || {}
  const recentNotices = dashboardData?.recentNotices || []

  const statCards = [
    {
      name: "My Subjects",
      value: stats.mySubjects || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      name: "Total Students",
      value: stats.totalStudents || 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      name: "Today's Attendance",
      value: stats.todayAttendance || 0,
      icon: ClipboardList,
      color: "bg-purple-500",
    },
    {
      name: "Recent Notices",
      value: stats.recentNotices || 0,
      icon: Bell,
      color: "bg-orange-500",
    },
  ]

  return (
    <Layout title="Faculty Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-md ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline btn-md">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Mark Attendance
                </button>
                <button className="btn btn-outline btn-md">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Marks
                </button>
                <button className="btn btn-outline btn-md">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </button>
                <button className="btn btn-outline btn-md">
                  <Bell className="w-4 h-4 mr-2" />
                  View Notices
                </button>
              </div>
            </div>
          </div>

          {/* Recent Notices */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Recent Notices</h3>
            </div>
            <div className="card-content">
              {recentNotices.length > 0 ? (
                <div className="space-y-3">
                  {recentNotices.slice(0, 3).map((notice, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-900">{notice.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(notice.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent notices</p>
              )}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
          </div>
          <div className="card-content">
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No classes scheduled for today</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FacultyDashboard
