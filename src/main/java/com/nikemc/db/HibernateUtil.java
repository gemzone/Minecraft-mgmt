package com.nikemc.db;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

@SuppressWarnings("deprecation")
public class HibernateUtil
{
	private static SessionFactory sessionFactory;
    private static ServiceRegistry serviceRegistry;

    static
    {
        try
        {
//          Configuration configuration = new Configuration();
            Configuration configuration = new Configuration().configure();

            serviceRegistry = new ServiceRegistryBuilder().applySettings(configuration.getProperties()).buildServiceRegistry();
            sessionFactory = configuration.buildSessionFactory(serviceRegistry);
        }
        catch (HibernateException he)
        {
            System.err.println("Error creating Session: " + he);
        }
    }

    public static SessionFactory getSessionFactory()
    {
        return sessionFactory;
    } 
}
