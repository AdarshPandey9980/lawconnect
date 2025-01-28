// app/api/document-stats/route.js
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import User from '@/models/user';
import AffidavitApplication from '@/models/affidavitApplication';
import CasteApplication from '@/models/casteApplication';
import DomicileApplication from '@/models/domicileApplication';
import FoodLicenseApplication from '@/models/foodApplication';
import GazetteApplication from '@/models/gazetteApplication';
import GSTRegistration from '@/models/gstApplication';
import IncomeApplication from '@/models/IncomeApplication';
import TaxReturn from '@/models/incometaxApplication';
import NonCreamyApplication from '@/models/noncreamyApplication';
import PANApplication from '@/models/panApplication';
import PassportApplication from '@/models/passportApplication';
import ShopLicenseApplication from '@/models/shoplicenseApplication';
import UdyogApplication from '@/models/udyogApplication';

export async function GET() {
  try {
    await connectDB();

    const models = [
      AffidavitApplication, CasteApplication, DomicileApplication,
      FoodLicenseApplication, GazetteApplication, GSTRegistration,
      IncomeApplication, TaxReturn, NonCreamyApplication,
      PANApplication, PassportApplication, ShopLicenseApplication,
      UdyogApplication
    ];

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Daily registrations for last 30 days
    const dailyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 30 }
    ]);

    // Weekly registrations
    const weeklyRegistrations = await User.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      { $limit: 52 }
    ]);

    // Monthly registrations
    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    // Yearly registrations
    const yearlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1 } }
    ]);

    // Get document counts
    const totalCounts = await Promise.all(
      models.map(model => model.countDocuments())
    );
    const total = totalCounts.reduce((acc, curr) => acc + curr, 0);

    // Get status-wise counts
    const statusPromises = models.map(model =>
      model.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    );

    const statusResults = await Promise.all(statusPromises);
    const stats = {
      pending: 0,
      active: 0,
      processed: 0,
      rejected: 0
    };

    statusResults.forEach(modelStats => {
      modelStats.forEach(stat => {
        switch(stat._id) {
          case 'pending':
            stats.pending += stat.count;
            break;
          case 'processing':
            stats.active += stat.count;
            break;
          case 'completed':
            stats.processed += stat.count;
            break;
          case 'rejected':
            stats.rejected += stat.count;
            break;
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          registrations: {
            daily: dailyRegistrations,
            weekly: weeklyRegistrations,
            monthly: monthlyRegistrations,
            yearly: yearlyRegistrations
          }
        },
        documents: {
          total,
          pending: stats.pending,
          active: stats.active,
          processed: stats.processed,
          rejected: stats.rejected
        }
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}