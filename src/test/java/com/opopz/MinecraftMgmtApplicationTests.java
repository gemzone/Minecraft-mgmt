package com.opopz;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MinecraftMgmtApplicationTests.class)
@WebAppConfiguration
public class MinecraftMgmtApplicationTests implements CommandLineRunner
{

	@Autowired
	
	
	@Test
	public void contextLoads()
	{
	}

	@Override
	public void run(String... arg0) throws Exception
	{
		// TODO Auto-generated method stub
		
	}

}
