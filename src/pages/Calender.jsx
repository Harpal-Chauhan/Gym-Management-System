import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
  });

  const canManage = ["admin", "manager", "trainer"].includes(role);

  useEffect(() => {
    fetchRole();
    fetchEvents();
  }, []);

  const fetchRole = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("USER FETCH ERROR:", userError);
        toast.error(`User fetch failed: ${userError.message}`);
        return;
      }

      if (!userData?.user) {
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("PROFILE FETCH ERROR:", profileError);
        toast.error(`Profile fetch failed: ${profileError.message}`);
        return;
      }

      setRole(profileData?.role || "");
    } catch (error) {
      console.error("ROLE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select(
          `
          id,
          title,
          description,
          event_date,
          start_time,
          end_time,
          created_by
        `,
        )
        .order("event_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("EVENT FETCH ERROR:", error);
        toast.error(`Event fetch failed: ${error.message}`);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error("EVENT FETCH ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManage) {
      toast.error("You don't have permission to manage events");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (!formData.event_date) {
      toast.error("Event date is required");
      return;
    }

    if (!formData.start_time) {
      toast.error("Start time is required");
      return;
    }

    if (formData.end_time && formData.end_time <= formData.start_time) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        toast.error("Please login again");
        return;
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        event_date: formData.event_date,
        start_time: formData.start_time,
        end_time: formData.end_time || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("calendar_events")
          .update(eventData)
          .eq("id", editingId);

        if (error) {
          console.error("EVENT UPDATE ERROR:", error);
          toast.error(`Event update failed: ${error.message}`);
          return;
        }

        toast.success("Event updated successfully");
      } else {
        const { error } = await supabase.from("calendar_events").insert({
          ...eventData,
          created_by: userData.user.id,
        });

        if (error) {
          console.error("EVENT CREATE ERROR:", error);
          toast.error(`Event creation failed: ${error.message}`);
          return;
        }

        toast.success("Event created successfully");
      }

      resetForm();
      await fetchEvents();
    } catch (error) {
      console.error("EVENT SAVE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
    });
  };

  const handleDelete = async (id) => {
    if (!canManage) {
      toast.error("You don't have permission to delete events");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("EVENT DELETE ERROR:", error);
        toast.error(`Event delete failed: ${error.message}`);
        return;
      }

      toast.success("Event deleted successfully");

      await fetchEvents();
    } catch (error) {
      console.error("EVENT DELETE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      start_time: "",
      end_time: "",
    });

    setEditingId(null);
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-[#155955] mb-1">GymFlow</p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Calendar
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and view your gym events and sessions.
          </p>
        </div>

        {/* Create / Edit Event */}
        {canManage && (
          <div className="bg-white border border-[#DEDCD2] rounded-3xl p-5 sm:p-6 lg:p-7 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-[#F0EDE5] flex items-center justify-center text-[#D8A85F] text-xl">
                📅
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#004643]">
                  {editingId ? "Edit Event" : "Create Event"}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingId
                    ? "Update the event details below."
                    : "Add a new event to the calendar."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-[#004643] mb-2">
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-[#004643] mb-2">
                    Event Date
                  </label>

                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-semibold text-[#004643] mb-2">
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-semibold text-[#004643] mb-2">
                    End Time
                  </label>

                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#004643] mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter event description"
                    rows="4"
                    className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#004643] hover:bg-[#155955] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Event"
                      : "Create Event"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto bg-[#F0EDE5] hover:bg-[#DEDCD2] text-[#004643] px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Events */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm overflow-hidden">
          {/* Events Header */}
          <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#004643]">
                  Events
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  All scheduled gym events.
                </p>
              </div>

              <div className="self-start sm:self-auto bg-[#F0EDE5] text-[#004643] px-4 py-2 rounded-full text-sm font-semibold">
                {events.length} Event
                {events.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {events.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F0EDE5] flex items-center justify-center text-[#D8A85F] text-2xl">
                📅
              </div>

              <p className="text-[#004643] font-semibold">No events found.</p>

              <p className="text-sm text-gray-500 mt-1">
                Create an event to see it here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-[#004643] text-white text-left">
                    <th className="py-4 px-5 text-sm font-semibold">Title</th>

                    <th className="py-4 px-5 text-sm font-semibold">Date</th>

                    <th className="py-4 px-5 text-sm font-semibold">Time</th>

                    <th className="py-4 px-5 text-sm font-semibold">
                      Description
                    </th>

                    {canManage && (
                      <th className="py-4 px-5 text-sm font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#DEDCD2] last:border-b-0 hover:bg-[#F7F5F0] transition"
                    >
                      {/* Title */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F0EDE5] text-[#004643] flex items-center justify-center">
                            📅
                          </div>

                          <span className="font-semibold text-[#004643]">
                            {event.title}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {event.event_date}
                      </td>

                      {/* Time */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F0EDE5] text-[#155955] text-sm font-semibold">
                          {formatTime(event.start_time)}
                          {" - "}
                          {formatTime(event.end_time)}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-5 text-sm text-gray-600 max-w-xs">
                        {event.description || "-"}
                      </td>

                      {/* Actions */}
                      {canManage && (
                        <td className="py-4 px-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(event)}
                              className="bg-[#F0EDE5] hover:bg-[#DEDCD2] text-[#004643] px-3 py-2 rounded-lg font-medium transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(event.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
