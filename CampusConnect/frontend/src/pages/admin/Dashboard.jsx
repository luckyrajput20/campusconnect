import { useQuery } from "react-query"
import Layout from "../../components/Layout"
import LoadingSpinner from "../../components/LoadingSpinner"
import api from "../../services/api"
import { Users, GraduationCap, BookOpen, Bell, TrendingUp, Calendar } from "lucide-react"

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery(
    "admin-dashboard",
    () => api.get("/admin/dashboard").then((res) => res.data),
    { refetchInterval: 30000 },
  )

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <LoadingSpinner size="lg" className="min-h-96" />
      </Layout>
    )
  }

  const statCards = [
    {
      name: "Total Students",
      value: stats?.stats?.totalStudents || 0,
      icon: Users,
      color: "bg-blue-500",
      change: `+${stats?.stats?.recentStudents || 0} this month`,
    },
    {
      name: "Total Faculty",
      value: stats?.stats?.totalFaculty || 0,
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      name: "Total Classes",
      value: stats?.stats?.totalClasses || 0,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      name: "Total Subjects",
      value: stats?.stats?.totalSubjects || 0,
      icon: BookOpen,
      color: "bg-orange-500",
    },
    {
      name: "Active Notices",
      value: stats?.stats?.activeNotices || 0,
      icon: Bell,
      color: "bg-red-500",
    },
  ]

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                          {stat.change && (
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {stat.change}
                            </div>
                          )}
                        </dd>
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
                  <Users className="w-4 h-4 mr-2" />
                  Add User
                </button>
                <button className="btn btn-outline btn-md">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Add Class
                </button>
                <button className="btn btn-outline btn-md">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Subject
                </button>
                <button className="btn btn-outline btn-md">
                  <Bell className="w-4 h-4 mr-2" />
                  Post Notice
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="card-content">
            <div className="flow-root">
              <ul className="-mb-8">
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <Users className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New student <span className="font-medium text-gray-900">John Doe</span> registered
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                </li>
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Bell className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          New notice <span className="font-medium text-gray-900">"Exam Schedule"</span> published
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">4 hours ago</div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                        <BookOpen className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Subject <span className="font-medium text-gray-900">"Data Structures"</span> added to CS-A
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">1 day ago</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
