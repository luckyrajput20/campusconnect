import { useQuery } from "react-query"
import Layout from "../../components/Layout"
import LoadingSpinner from "../../components/LoadingSpinner"
import api from "../../services/api"
import { ClipboardList, Award, BookOpen, Bell } from "lucide-react"

const StudentDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    "student-dashboard",
    () => api.get("/student/dashboard").then((res) => res.data),
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
  const recentMarks = dashboardData?.recentMarks || []
  const recentNotices = dashboardData?.recentNotices || []

  const statCards = [
    {
      name: "Total Subjects",
      value: stats.totalSubjects || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      name: "Attendance",
      value: `${stats.attendancePercentage || 0}%`,
      icon: ClipboardList,
      color: stats.attendancePercentage >= 75 ? "bg-green-500" : "bg-red-500",
      subtitle: `${stats.presentClasses || 0}/${stats.totalClasses || 0} classes`,
    },
    {
      name: "Recent Marks",
      value: stats.recentMarks || 0,
      icon: Award,
      color: "bg-purple-500",
    },
    {
      name: "New Notices",
      value: stats.recentNotices || 0,
      icon: Bell,
      color: "bg-orange-500",
    },
  ]

  return (
    <Layout title="Student Dashboard">
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
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        </dd>
                        {stat.subtitle && <dd className="text-sm text-gray-600">{stat.subtitle}</dd>}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Marks */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Recent Marks</h3>
            </div>
            <div className="card-content">
              {recentMarks.length > 0 ? (
                <div className="space-y-3">
                  {recentMarks.map((mark, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{mark.subject?.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{mark.assessment_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {mark.mark}/{mark.max_mark}
                        </p>
                        <p className="text-sm text-gray-600">{Math.round((mark.mark / mark.max_mark) * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent marks available</p>
              )}
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
                  {recentNotices.map((notice, index) => (
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

        {/* Attendance Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Attendance Overview</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.presentClasses || 0}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {(stats.totalClasses || 0) - (stats.presentClasses || 0)}
                </div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.attendancePercentage || 0}%</div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
            </div>

            {stats.attendancePercentage < 75 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ Your attendance is below 75%. Please attend classes regularly to meet the minimum requirement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StudentDashboard
