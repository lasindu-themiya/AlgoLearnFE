import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  List, 
  Layers, 
  CircleDot,
  Database,
  Play,
  Users,
  Star
} from 'lucide-react';
import { Button } from '../components/ui';

/**
 * Landing Page Component
 * Main marketing page for AlgoPulse with features overview
 */
export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <List className="h-8 w-8" />,
      title: 'Linked Lists',
      description: 'Visualize singly, doubly, and circular linked lists with interactive operations'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Stacks',
      description: 'Understand LIFO operations with animated push and pop visualizations'
    },
    {
      icon: <CircleDot className="h-8 w-8" />,
      title: 'Queues',
      description: 'Master FIFO operations with enqueue and dequeue animations'
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Session Management',
      description: 'Save and restore your data structure sessions across visits'
    },
    {
      icon: <Play className="h-8 w-8" />,
      title: 'Interactive Learning',
      description: 'Learn by doing with real-time operation feedback and guidance'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multi-user Support',
      description: 'Create separate accounts and manage individual learning progress'
    }
  ];

  const stats = [
    { label: 'Data Structures', value: '3+' },
    { label: 'Operations', value: '20+' },
    { label: 'Animations', value: '100%' },
    { label: 'Learning Path', value: 'Guided' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">AlgoPulse</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 px-6 py-2">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-6 py-2 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-100 mb-8 leading-tight">
              Visualize Data Structures
              <span className="block bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-4">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Master data structures through interactive visualizations. Watch your code come to life 
              with animated operations on linked lists, stacks, and queues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-12 py-4 text-lg font-semibold shadow-2xl shadow-teal-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  Start Learning
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="border-2 border-gray-500 text-gray-300 hover:border-teal-400 hover:bg-teal-400/10 hover:text-teal-300 px-12 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-600/15 to-orange-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-dark-900/40 via-dark-900/30 to-dark-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">
                  {stat.value}
                </div>
                <div className="text-base text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-6">
              Everything You Need to 
              <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Master Data Structures
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From basic operations to advanced concepts, AlgoPulse provides comprehensive 
              interactive tools for understanding and mastering data structures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative bg-gradient-to-br from-dark-900/60 to-dark-900/40 border border-gray-700 rounded-2xl p-8 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-teal-400 mb-6 group-hover:text-teal-300 transition-colors transform group-hover:scale-110 duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-900/30 via-dark-900/50 to-amber-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-amber-600/10"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-6">
            Ready to Master 
            <span className="block bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
              Data Structures?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and developers who are mastering algorithms and data structures 
            through interactive visualizations with AlgoPulse.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-12 py-4 text-lg font-semibold shadow-2xl shadow-teal-500/25 transform hover:scale-105 transition-all duration-200"
              >
                <Star className="mr-3 h-6 w-6" />
                Start Learning Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">AlgoPulse</span>
            </div>
            
            <div className="text-base text-gray-400">
              © 2024 AlgoPulse. Built for interactive learning and mastery.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};