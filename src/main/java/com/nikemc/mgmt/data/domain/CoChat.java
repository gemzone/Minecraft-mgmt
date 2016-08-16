package com.nikemc.mgmt.data.domain;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * CoChat generated by hbm2java
 */
@Entity
@Table(name = "co_chat", catalog = "co")
public class CoChat implements java.io.Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer rowid;
	private Integer time;
	//private Integer user;
	private String message;

	
	private CoUser user;
	
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="user")
	public CoUser getUser()
	{
		return this.user;
	}

	public void setUser(CoUser user)
	{
		this.user = user;
	}
	
	
	
	
	public CoChat()
	{
	}

	public CoChat(Integer time, CoUser user, String message)
	{
		this.time = time;
		this.user = user;
		this.message = message;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "rowid", unique = true, nullable = false)
	public Integer getRowid()
	{
		return this.rowid;
	}

	public void setRowid(Integer rowid)
	{
		this.rowid = rowid;
	}

	@Column(name = "time")
	public Integer getTime()
	{
		return this.time;
	}

	public void setTime(Integer time)
	{
		this.time = time;
	}

//	@Column(name = "user")
//	public Integer getUser()
//	{
//		return this.user;
//	}
//
//	public void setUser(Integer user)
//	{
//		this.user = user;
//	}

	@Column(name = "message")
	public String getMessage()
	{
		return this.message;
	}

	public void setMessage(String message)
	{
		this.message = message;
	}

}