package com.nikemc.mgmt.data.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CoSkull generated by hbm2java
 */
@Entity
@Table(name = "co_skull", catalog = "co")
public class CoSkull implements java.io.Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer rowid;
	private Integer time;
	private Integer type;
	private Integer data;
	private Integer rotation;
	private String owner;

	public CoSkull()
	{
	}

	public CoSkull(Integer time, Integer type, Integer data, Integer rotation, String owner)
	{
		this.time = time;
		this.type = type;
		this.data = data;
		this.rotation = rotation;
		this.owner = owner;
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

	@Column(name = "type")
	public Integer getType()
	{
		return this.type;
	}

	public void setType(Integer type)
	{
		this.type = type;
	}

	@Column(name = "data")
	public Integer getData()
	{
		return this.data;
	}

	public void setData(Integer data)
	{
		this.data = data;
	}

	@Column(name = "rotation")
	public Integer getRotation()
	{
		return this.rotation;
	}

	public void setRotation(Integer rotation)
	{
		this.rotation = rotation;
	}

	@Column(name = "owner", length = 16)
	public String getOwner()
	{
		return this.owner;
	}

	public void setOwner(String owner)
	{
		this.owner = owner;
	}

}
